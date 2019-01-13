import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, flatMap, map, switchMap, tap} from 'rxjs/operators';
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
  trackIdList$: Observable<string[]>;
  constructor(private http: HttpClient) {
    this.searchValue$ = this.searchValue$$.asObservable();
  }
  ngOnInit(): void {
    this.searchValue$.pipe(
      filter((searchValue) => !!searchValue),
      switchMap((searchValue) => this.trackSearch(searchValue)),
      flatMap((trackid) => this.lyricSearch(trackid)),
      switchMap((lyric) => this.sentimentAnalytics(lyric))
    ).subscribe();
    this.searchValue$.pipe(
      filter((searchValue) => !!searchValue),
      switchMap((searchValue) => this.imageFetch(searchValue)),
    ).subscribe();
  }

  onSearchChange(searchValue: string) {
    this.searchValue$$.next(searchValue);
  }


  trackSearch(artistName: string): Observable<any> {
    const url = `${this.baseURL}track.search?&q_artist=${artistName}
    &page_size=3&page=1&s_track_rating=desc&apikey=984243ce7ca61e61a35a3151cb408bb5`;
    return this.http.get(url).pipe(
      map((result: {message: {body: {track_list: [{track: {track_id: string}}]}}}) => {
        return result.message.body.track_list.map(track_list => track_list.track.track_id);
      })
    );
  }

  lyricSearch(trackId: string): Observable<any> {
    const url = `${this.baseURL}track.lyrics.get?track_id=${trackId}&apikey=984243ce7ca61e61a35a3151cb408bb5`;
    return this.http.get(url).pipe(
      map((result: {message: {body: {lyrics: {lyrics_body: string}}}}) => result.message.body.lyrics.lyrics_body),
      map((lyrics: string) => {
        lyrics = lyrics.replace('\n', ' ');
        return lyrics.substr(0, lyrics.indexOf('*****'));
      })
    );
  }

  sentimentAnalytics(lyrics: string): Observable<any> {
    const url = `https://cors-anywhere.herokuapp.com/http://204.209.76.199:5000/query-lyric-sentiment?lyrics=${lyrics}`;
    return this.http.get(url).pipe(tap(console.log));
  }

  imageFetch(artistName: string): Observable<any> {
    const url = `https://cors-anywhere.herokuapp.com/http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName.replace(' ', '%20')}&api_key=a055cea90f3f2dc90e6775c6cca0c605&format=json`;
    return this.http.get(url).pipe(
      map((result: {artist: {image: [{}]}}) => 
        {
          var obj = JSON.parse(JSON.stringify(result.artist.image));
          var element = <HTMLInputElement>document.getElementById("photo_of_musician");
          element.src = obj[5]['#text'];
          return obj[5]['#text'];
        }
      )
    );
  }
}
