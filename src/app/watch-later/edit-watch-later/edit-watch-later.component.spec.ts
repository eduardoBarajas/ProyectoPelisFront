import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWatchLaterComponent } from './edit-watch-later.component';

describe('EditWatchLaterComponent', () => {
  let component: EditWatchLaterComponent;
  let fixture: ComponentFixture<EditWatchLaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWatchLaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWatchLaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
