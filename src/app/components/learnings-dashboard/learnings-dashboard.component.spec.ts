import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningsDashboardComponent } from './learnings-dashboard.component';

describe('LearningsDashboardComponent', () => {
  let component: LearningsDashboardComponent;
  let fixture: ComponentFixture<LearningsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearningsDashboardComponent]
    });
    fixture = TestBed.createComponent(LearningsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
