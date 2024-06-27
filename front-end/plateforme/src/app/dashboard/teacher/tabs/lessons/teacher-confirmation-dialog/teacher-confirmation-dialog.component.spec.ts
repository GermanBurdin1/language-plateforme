import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherConfirmationDialogComponent } from './teacher-confirmation-dialog.component';

describe('TeacherConfirmationDialogComponent', () => {
  let component: TeacherConfirmationDialogComponent;
  let fixture: ComponentFixture<TeacherConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherConfirmationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
