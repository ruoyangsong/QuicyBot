import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, EMPTY, empty, forkJoin, Observable} from 'rxjs';
import {catchError, filter, map, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-input-bar',
  templateUrl: './input-bar.component.html',
  styleUrls: ['./input-bar.component.scss']
})
export class InputBarComponent implements OnInit {
  baseURL = 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/';
  searchValue$$: BehaviorSubject<string> = new BehaviorSubject('');
  searchValue$: Observable<string>;

  actorName$: Observable<string>;
  actorName$$: BehaviorSubject<string> = new BehaviorSubject('');

  lyrics$: Observable<string[]>;
  lyrics$$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  sentimentScore$: Observable<string[]>;
  sentimentScore$$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  progressBarLoading$$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  progressBarLoading$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.searchValue$ = this.searchValue$$.asObservable();
    this.actorName$ = this.actorName$$.asObservable();
    this.lyrics$ = this.lyrics$$.asObservable();
    this.sentimentScore$ = this.sentimentScore$$.asObservable();
    this.progressBarLoading$ = this.progressBarLoading$$.asObservable();
  }
  ngOnInit(): void {
    this.searchValue$.pipe(
      filter((searchValue) => !!searchValue),
      tap(() => this.progressBarLoading$$.next(true)),
      catchError(() => {
        this.progressBarLoading$$.next(false);
        return EMPTY;
      }),
      switchMap((searchValue) => this.trackSearch(searchValue)),
      switchMap((trackidList) => this.lyricSearch(trackidList)),
      tap((lyricsList: string[]) => this.lyrics$$.next(lyricsList)),
      switchMap((lyricsList: string[]) => this.sentimentAnalytics(lyricsList)),
      tap((sentimentScore: string[]) => {
        debugger;
        this.sentimentScore$$.next(sentimentScore);
        this.progressBarLoading$$.next(false);
      })
    ).subscribe();
  }

  onSearchChange(searchValue: string) {
    this.searchValue$$.next(searchValue);
  }

  trackSearch(artistName: string): Observable<any> {
    const url = `${this.baseURL}track.search?&q_artist=${artistName}
    &page_size=3&page=1&s_track_rating=desc&apikey=984243ce7ca61e61a35a3151cb408bb5`;
    return this.http.get(url).pipe(
      map((result: {message: {body: {track_list: [{track: {track_id: string, artist_name: string}}]}}}) => {
        this.actorName$$.next(result.message.body.track_list[0].track.artist_name);
        return result.message.body.track_list.map(track_list => track_list.track.track_id);
      })
    );
  }

  lyricSearch(trackIdList: string[]): Observable<any> {
    const observableBatch = [];
    trackIdList.forEach((trackId) => {
      const url = `${this.baseURL}track.lyrics.get?track_id=${trackId}&apikey=984243ce7ca61e61a35a3151cb408bb5`;
      observableBatch.push(
        this.http.get(url).pipe(
          map((result: {message: {body: {lyrics: {lyrics_body: string}}}}) => result.message.body.lyrics.lyrics_body),
          map((lyrics: string) => {
            lyrics = lyrics.replace('\n', ' ');
            return lyrics.substr(0, lyrics.indexOf('*****'));
          })
        )
      );
    });
    return forkJoin(observableBatch);
  }

  sentimentAnalytics(lyricsList: string[]): Observable<any> {
    const observableBatch = [];
    lyricsList.forEach((lyrics) => {
      const url = `https://cors-anywhere.herokuapp.com/http://204.209.76.199:5000/query-lyric-sentiment?lyrics=${lyrics}`;
      observableBatch.push(
        this.http.get(url).pipe(
          map((result: {documents: [{score: string}]}) => result.documents[0].score)
        )
      );
    });
    return forkJoin(observableBatch);
  }
}
