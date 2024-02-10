import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // исправлено на styleUrls
})
export class DashboardComponent implements OnInit {
  name: string = '';
  token: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Получаем токен из сервиса аутентификации
    const token = this.authService.getToken();
    if (token) {
      // Если токен не пустой, получаем имя пользователя с использованием полученного токена
      this.authService.getUserName(token).subscribe({
        next: (userName: string) => {
          this.name = userName;
        },
        error: (error) => {
          console.error('Error getting user name:', error);
        }
      });
    } else {
      console.error('Token is empty.');
    }
  }
}
