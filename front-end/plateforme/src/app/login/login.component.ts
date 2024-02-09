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

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe({
        next: (response) => {
          if (response && response.token) {
            // Сохраняем полученный токен
            localStorage.setItem('token', response.token);
            // Перенаправляем на страницу /home
            this.router.navigate(['/dashboard']);
          } else {
            // Обрабатываем случай, когда в ответе нет токена
            console.error('Token is missing in the response');
            // Здесь можно добавить логику для информирования пользователя об ошибке
          }
        },
        error: (err) => {
          // Обрабатываем ошибки аутентификации
          console.error(err);
          // Здесь можно добавить логику для информирования пользователя о проблеме
        }
      });
    }
  }

}

