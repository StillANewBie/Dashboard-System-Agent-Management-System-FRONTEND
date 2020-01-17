import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizeMeetingComponent } from './organize-meeting.component';

describe('OrganizeMeetingComponent', () => {
  let component: OrganizeMeetingComponent;
  let fixture: ComponentFixture<OrganizeMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizeMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizeMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
