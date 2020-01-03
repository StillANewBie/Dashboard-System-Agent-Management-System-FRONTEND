import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStateComponent } from './agent-state.component';

describe('AgentStateComponent', () => {
  let component: AgentStateComponent;
  let fixture: ComponentFixture<AgentStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
