import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { trigger, transition, state, animate, style } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('childAnimation', [
      // ...
      state('open', style({
        opacity: 0,
        'transform': 'translateY(-650px)'

      })),
      state('closed', style({
        // width: '100px',
        // opacity: 0.5,
        // backgroundColor: 'green'
      })),
      transition('* => *', [
        animate('1.5s ease-in')
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit {

  isOpen = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  redirectToInput() {
    this.isOpen = !this.isOpen;
    setTimeout(function () {
      this.router.navigateByUrl('/input');
    }.bind(this), 1500);

  }

}
