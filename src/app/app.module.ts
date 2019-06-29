import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoviesModule } from './movies/movies.module';
import { MoviesRoutingModule } from './movies/movies-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NavigationComponentComponent } from './navigation-component/navigation-component.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { MovieDialogComponent } from './dialogs/movie-dialog/movie-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponentComponent,
    MovieDialogComponent
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
    MatToolbarModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MoviesModule,
    MoviesRoutingModule,
    AppRoutingModule
  ],
  providers: [{provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3500, verticalPosition: 'bottom',
  entryComponents: [
    MovieDialogComponent
  ],
  panelClass: ['success-snackbar']}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
