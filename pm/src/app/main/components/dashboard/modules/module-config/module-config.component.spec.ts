import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleConfigComponent } from './module-config.component';

describe('ModuleConfigComponent', () => {
  let component: ModuleConfigComponent;
  let fixture: ComponentFixture<ModuleConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
