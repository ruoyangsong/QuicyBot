import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-lyrics-panel',
  templateUrl: './lyrics-panel.component.html',
  styleUrls: ['./lyrics-panel.component.scss']
})
export class LyricsPanelComponent implements OnInit {
  @Input() actorName: string;
  @Input() trackNameList: string[];
  @Input() lyricsList: string[];
  @Input() sentimentScoreList: number[];
  constructor() { }

  ngOnInit() {

  }

}
