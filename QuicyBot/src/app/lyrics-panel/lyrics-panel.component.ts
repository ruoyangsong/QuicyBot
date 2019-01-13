import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-lyrics-panel',
  templateUrl: './lyrics-panel.component.html',
  styleUrls: ['./lyrics-panel.component.scss']
})
export class LyricsPanelComponent implements OnInit {
  @Input() actorName: string;
  @Input() lyrics: string[];
  @Input() sentimentScore: string[];
  constructor() { }

  ngOnInit() {

  }

}
