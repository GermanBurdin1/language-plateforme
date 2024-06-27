import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMyPageComponent } from './teacher-my-page.component';

describe('TeacherMyPageComponent', () => {
  let component: TeacherMyPageComponent;
  let fixture: ComponentFixture<TeacherMyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherMyPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherMyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
