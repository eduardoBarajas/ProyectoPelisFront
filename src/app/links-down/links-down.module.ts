import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListLinksComponent } from './list-links/list-links.component';
import { EditLinksComponent } from './edit-links/edit-links.component';

@NgModule({
  declarations: [ListLinksComponent, EditLinksComponent],
  imports: [
    CommonModule
  ]
})
export class LinksDownModule { }
