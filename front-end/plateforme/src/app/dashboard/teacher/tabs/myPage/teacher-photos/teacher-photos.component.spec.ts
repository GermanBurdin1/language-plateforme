import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPhotosComponent } from './teacher-photos.component';

describe('TeacherPhotosComponent', () => {
  let component: TeacherPhotosComponent;
  let fixture: ComponentFixture<TeacherPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherPhotosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
