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

  loginBtnVisible = true;
  activeLink = 'Inicio';
  linksMap = new Map<string, string>();
  linksIcons = new Map<string, string>();
  links = [];
  firstRun = true;
  inAuthScreen = false;
  userLinks = ['Inicio', 'Catalogo'];
  adminLinks = ['Inicio', 'Agregar Peliculas', 'Editar Peliculas', 'Catalogo', 'Mis Peliculas'];

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
          this.links = this.adminLinks;
        } else {
          this.links = this.userLinks;
        }
        this.loginBtnVisible = false;
      } else {
        this.links = this.userLinks;
        this.loginBtnVisible = true;
      }
      if (location.href.split('/')[3].includes('login') || location.href.split('/')[3].includes('signup')) {
        this.inAuthScreen = true;
        this.activeLink = '';
      } else {
        this.inAuthScreen = false;
        if (this.activeLink === '') {
          this.activeLink = 'Inicio';
        }
      }
      this.setLinksMap();
    });
  }

  setLinksMap() {
    this.links.forEach( link => {
      switch (link) {
        case 'Inicio': { this.linksMap.set(link, '/'); this.linksIcons.set(link, 'home'); break; }
        case 'Agregar Peliculas': { this.linksMap.set(link, '/add'); this.linksIcons.set(link, 'add'); break; }
        case 'Editar Peliculas': { this.linksMap.set(link, '/edit'); this.linksIcons.set(link, 'edit'); break; }
        case 'Catalogo': { this.linksMap.set(link, '/catalog'); this.linksIcons.set(link, 'movie'); break; }
        case 'Mis Peliculas': { this.linksMap.set(link, '/my-movies'); this.linksIcons.set(link, 'playlist_play'); break; }
      }
      if (this.firstRun) {
        if (this.linksMap.get(link) === `/${location.href.split('/')[3]}`) {
            this.activeLink = link;
            this.firstRun = false;
        }
      }
    });
  }

  logOut() {
    this.authService.logOut();
    this.links = this.userLinks;
    this.loginBtnVisible = true;
    this.activeLink = this.userLinks[0];
    this.snackbar.open('Se cerro la session');
    this.route.navigate(['/']);
  }

}
