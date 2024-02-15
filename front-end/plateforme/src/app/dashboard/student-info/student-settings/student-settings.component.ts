import { Component } from '@angular/core';

@Component({
  selector: 'app-student-settings',
  templateUrl: './student-settings.component.html',
  styleUrl: './student-settings.component.scss'
})
export class StudentSettingsComponent {
  // Данные студента для примера, замените этими данными ваше реальное состояние компонента
  student = {
    name: 'Ivan',
    email: 'ivanstudent90@mail.ru',
    password: '2782',
    location: 'Moscow',
    nativeLanguage: 'Russian',
    timezone: '03:09 (UTC+3)',
    skype: 'Student\'s Skype',
    zoom: 'Call link'
  };
}
