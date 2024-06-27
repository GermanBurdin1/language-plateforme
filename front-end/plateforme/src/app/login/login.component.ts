import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Форма логина валидна, отправка запроса на сервер');
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            const token = localStorage.getItem('token');
            console.log('Получен токен:', token);
            if (token) {
              this.authService.getUserRole(token).subscribe({
                next: (roleResponse) => {
                  const role = roleResponse.role.trim().toLowerCase();
                  console.log('Получена роль пользователя:', role);
                  if (role === 'student') {
                    console.log('Перенаправление на /dashboard-student');
                    this.router.navigate(['/dashboard-student']);
                  } else if (role === 'teacher') {
                    console.log('Перенаправление на /dashboard-teacher');
                    this.router.navigate(['/dashboard-teacher']);
                  } else {
                    console.error('Неизвестная роль:', role);
                  }
                },
                error: (err) => {
                  console.error('Ошибка при получении роли пользователя:', err);
                }
              });
            } else {
              console.error('Токен отсутствует после логина');
            }
          } else {
            console.error('Неизвестная или отсутствующая роль');
          }
        },
        error: (err) => {
          console.error('Ошибка при логине:', err);
        }
      });
    } else {
      console.error('Форма логина невалидна');
    }
  }
}
