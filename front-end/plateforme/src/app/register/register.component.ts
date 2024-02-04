import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Определение интерфейса для данных формы
interface FormData {
  e_mail?: string;
  login?: string;
  password: string;
  name: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Инициализация формы с полями
    this.registerForm = this.fb.group({
      emailOrLogin: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required]
    });
  }

  onSubmit() {

    if (this.registerForm.valid) {
      // Создание объекта formData с использованием интерфейса
      let formData: FormData = {
        password: this.registerForm.value.password,
        name: this.registerForm.value.name
      };

      // Определение, является ли введенное значение e-mail или логином
      const emailOrLogin = this.registerForm.value.emailOrLogin;
      if (emailOrLogin.includes('@')) {
        // Если значение является e-mail
        formData.e_mail = emailOrLogin;
      } else {
        // Если значение является логином
        formData.login = emailOrLogin;
      }

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      // Отправка данных на сервер
      this.http.post('http://learn-lang-platform.local/back-end/AngularRequestsHandler.php', formData, { headers }).subscribe({
        next: (response) => console.log('Успех:', response),
        error: (error) => console.error('Ошибка:', error)
      });
    }
    else {
      console.error('Форма невалидна:', this.registerForm.errors);
    }
  }
}
