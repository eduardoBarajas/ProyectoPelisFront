import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSuggestionsComponent } from './list-suggestions/list-suggestions.component';
import { AddSuggestionComponent } from './add-suggestion/add-suggestion.component';
import { EditSuggestionComponent } from './edit-suggestion/edit-suggestion.component';

@NgModule({
  declarations: [ListSuggestionsComponent, AddSuggestionComponent, EditSuggestionComponent],
  imports: [
    CommonModule
  ]
})
export class SuggestionsModule { }
