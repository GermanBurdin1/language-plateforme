import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentProfileService } from '../../../../services/student-profile.service';
import { AuthService } from '../../../../auth.service';

@Component({
  selector: 'app-student-settings',
  templateUrl: './student-settings.component.html',
  styleUrls: ['./student-settings.component.scss']
})
export class StudentSettingsComponent {
  student = {
    location: '',
    native_Language: '',
    timezone: '',
    skype: '',
    call_link: ''
  };

  constructor(
    public activeModal: NgbActiveModal,
    private studentProfileService: StudentProfileService,
    private authService: AuthService
  ) {}

  saveChanges() {
    const userId = this.authService.getUserId();
    const profileStudentData = {
      ...this.student,
      userId: userId
  };
    console.log(userId);
    console.log('Saving changes', this.student);
    this.studentProfileService.createOrUpdateProfile(profileStudentData).subscribe({
      next: (response) => {
        console.log('Profile created or updated successfully', response);
        this.activeModal.close('Save click');
      },
      error: (error) => {
        console.error('Error creating or updating profile', error);
      }
    });
  }
}
