import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(public activeModal: NgbActiveModal) {}

  // Здесь может быть ваша дополнительная логика инициализации компонента

  saveChanges() {
    // Здесь должна быть логика для сохранения изменений
    console.log('Saving changes', this.student);
    // После сохранения изменений можно закрыть модальное окно
    this.activeModal.close('Save click');
  }
}
