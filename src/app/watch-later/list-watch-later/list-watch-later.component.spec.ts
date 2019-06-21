import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWatchLaterComponent } from './list-watch-later.component';

describe('ListWatchLaterComponent', () => {
  let component: ListWatchLaterComponent;
  let fixture: ComponentFixture<ListWatchLaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWatchLaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWatchLaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
