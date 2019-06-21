import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSuggestionsComponent } from './list-suggestions.component';

describe('ListSuggestionsComponent', () => {
  let component: ListSuggestionsComponent;
  let fixture: ComponentFixture<ListSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSuggestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
