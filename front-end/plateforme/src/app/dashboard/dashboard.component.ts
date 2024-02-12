import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { VideoCallComponent } from '../video-call/video-call.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  name: string = '';
  token: string | null = null;

  // Используем ViewChild для получения доступа к методам VideoCallComponent
  @ViewChild(VideoCallComponent) videoCallComponent!: VideoCallComponent;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Получаем токен из сервиса аутентификации
    this.token = this.authService.getToken();
    if (this.token) {
      // Получаем имя пользователя с использованием полученного токена
      this.authService.getUserName(this.token).subscribe({
        next: (response) => {
          this.name = response.name;
        },
        error: (error) => {
          console.error('Error getting user name:', error);
        }
      });
    } else {
      console.error('Token is empty.');
    }
  }

  // Методы для взаимодействия с VideoCallComponent
  startVideoCall(): void {
    // Убедитесь, что videoCallComponent загружен
    if (this.videoCallComponent) {
      this.videoCallComponent.startCall();
    } else {
      console.error('VideoCallComponent is not loaded');
    }
  }

  endVideoCall(): void {
    // Убедитесь, что videoCallComponent загружен
    if (this.videoCallComponent) {
      this.videoCallComponent.endCall();
    } else {
      console.error('VideoCallComponent is not loaded');
    }
  }
}
