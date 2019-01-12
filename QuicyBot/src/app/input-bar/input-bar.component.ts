import { Component, OnInit } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
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
    ).subscribe();

  }

  onSearchChange(searchValue: string) {
    // this.trackSearch(searchValue).pipe(
    //   map((result: {message: {body: {track_list: [{track: {track_id: string}}]}}}) => {
    //     return result.message.body.track_list.map(track_list => track_list.track.track_id);
    //   }),
    //   ).subscribe();
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
    return this.http.get(url);
  }
}
