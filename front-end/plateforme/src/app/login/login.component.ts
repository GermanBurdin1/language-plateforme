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
        next: () => {
          // После успешного входа получаем роль пользователя из localStorage
          const role = this.authService.getUserRole();
          if (role === 'teacher') {
            // Редирект на дашборд учителя
            this.router.navigate(['/dashboard-teacher']);
          } else if (role === 'student') {
            // Редирект на дашборд студента
            this.router.navigate(['/dashboard-student']);
          } else {
            // Обработка неизвестной или отсутствующей роли
            console.error('Unknown or missing role');
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

