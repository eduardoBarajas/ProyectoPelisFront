import { Component, OnInit } from '@angular/core';
import { query, trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation-component',
  templateUrl: './navigation-component.component.html',
  styleUrls: ['./navigation-component.component.css'],
  animations: [
    trigger('fadeAnimation', [
    transition('* => *', [
      query(
        ':enter',
        [style({ opacity: 0})],
        { optional: true }
      ),
      query(
        ':leave',
        [style({ opacity: 1 }), animate('0s', style({ opacity: 0}))],
        { optional: true }
      ),
      query(
        ':enter',
        [style({ opacity: 0 }), animate('1s', style({ opacity: 1 }))],
        { optional: true }
      )
    ])
  ]),
  // the fade-in/fade-out animation.
  trigger('simpleFadeAnimation', [
    state('void', style({ opacity: 0, })),
    state('*', style({ opacity: 1, })),
    transition(':enter', animate(`1000ms ease-out`)),
    transition(':leave', animate(`1000ms ease-in`))
  ])]
})
export class NavigationComponentComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
  }

}
