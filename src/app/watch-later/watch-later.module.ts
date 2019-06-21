import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListWatchLaterComponent } from './list-watch-later/list-watch-later.component';
import { EditWatchLaterComponent } from './edit-watch-later/edit-watch-later.component';

@NgModule({
  declarations: [ListWatchLaterComponent, EditWatchLaterComponent],
  imports: [
    CommonModule
  ]
})
export class WatchLaterModule { }
