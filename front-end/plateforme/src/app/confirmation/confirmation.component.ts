import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Подписываемся на Observable, чтобы получить роль
    const token = this.authService.getToken(); // Получаем токен
    if (token) {
      this.authService.getUserRole(token).subscribe({
      next: (role) => {
        // Задержка или ожидание подтверждения пользователем
        setTimeout(() => {
          // Редирект на соответствующий дашборд
          if (role === 'student') {
            this.router.navigate(['/student-dashboard']);
          } else if (role === 'teacher') {
            this.router.navigate(['/teacher-dashboard']);
          }
        }, 3000); // 3 секунды для примера, можно заменить на другую логику
      },
      error: (err) => {
        console.error('Error fetching user role', err);
      }
      });
    }
    else {
      console.log('Token is missing');
    }
}
}
