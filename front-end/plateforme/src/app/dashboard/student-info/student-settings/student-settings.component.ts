import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentProfileService } from '../../../services/student-profile.service';

@Component({
  selector: 'app-student-settings',
  templateUrl: './student-settings.component.html',
  styleUrls: ['./student-settings.component.scss']
})
export class StudentSettingsComponent {
  student = {
    name: '',
    email: '',
    password: '',
    location: '',
    nativeLanguage: '',
    timezone: '',
    skype: '',
    zoom: ''
  };

  constructor(
    public activeModal: NgbActiveModal,
    private studentProfileService: StudentProfileService // Инжектируем сервис
  ) {}

  saveChanges() {
    console.log('Saving changes', this.student);
    // Используем сервис для отправки данных на сервер
    this.studentProfileService.createOrUpdateProfile(this.student).subscribe({
      next: (response) => {
        console.log('Profile created or updated successfully', response);
        this.activeModal.close('Save click'); // Закрываем модальное окно после успешного сохранения
      },
      error: (error) => {
        console.error('Error creating or updating profile', error);
      }
    });
  }
}
