import { Component, OnInit, AfterViewInit } from '@angular/core';
import { query, trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { RouterEvent, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material';

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

  adminLinks = false;
  loginBtn = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private route: Router,
    private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.events.pipe(
      filter( e => e instanceof NavigationEnd || e instanceof NavigationStart)
    ).subscribe( () => {
      if (this.authService.checkIfTokenIsValid()) {
        if (localStorage.getItem('authority').includes('1')) {
          this.adminLinks = true;
        } else {
          this.adminLinks = false;
        }
        this.loginBtn = false;
      } else {
        this.loginBtn = true;
      }
    });
  }

  logOut() {
    this.authService.logOut();
    this.adminLinks = false;
    this.loginBtn = true;
    this.snackbar.open('Se cerro la session');
    this.route.navigate(['/']);
  }
}
