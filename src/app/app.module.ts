import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoviesModule } from './movies/movies.module';
import { MoviesRoutingModule } from './movies/movies-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavigationComponentComponent } from './navigation-component/navigation-component.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatPaginatorIntl } from '@angular/material';
import { MovieDialogComponent } from './dialogs/movie-dialog/movie-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { AuthModule } from './auth/auth.module';
import { HttpConfigInterceptor } from './Interceptors/httpconfig.interceptor';
import { LinksDialogComponent } from './dialogs/links-dialog/links-dialog.component';
import { MatPaginatorIntlMX } from './helpers/MatPaginatorIntlMX';
import {MatTabsModule} from '@angular/material/tabs';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponentComponent,
    MovieDialogComponent,
    LinksDialogComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MoviesModule,
    MoviesRoutingModule,
    AuthModule,
    AppRoutingModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlMX},
    {provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3500, verticalPosition: 'bottom',
  entryComponents: [
    MovieDialogComponent, LinksDialogComponent
  ],
  panelClass: ['success-snackbar']}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
