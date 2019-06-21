import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLinksComponent } from './list-links.component';

describe('ListLinksComponent', () => {
  let component: ListLinksComponent;
  let fixture: ComponentFixture<ListLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
