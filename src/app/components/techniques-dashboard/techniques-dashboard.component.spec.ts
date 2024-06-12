import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechniquesDashboardComponent } from './techniques-dashboard.component';

describe('TechniquesDashboardComponent', () => {
  let component: TechniquesDashboardComponent;
  let fixture: ComponentFixture<TechniquesDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechniquesDashboardComponent]
    });
    fixture = TestBed.createComponent(TechniquesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
