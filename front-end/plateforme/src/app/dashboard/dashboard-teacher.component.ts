import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { VideoCallComponent } from '../video-call/video-call.component';

@Component({
  selector: 'app-dashboard-teacher',
  templateUrl: './dashboard-teacher.component.html',
  styleUrls: ['./dashboard-teacher.component.scss']
})
export class DashboardTeacherComponent implements OnInit {
  name: string = '';
  token: string | null = null;

  @ViewChild(VideoCallComponent) videoCallComponent!: VideoCallComponent;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Получаем токен из сервиса аутентификации
    this.token = this.authService.getToken();
    if (this.token) {
      this.authService.getUserName(this.token).subscribe({
        next: (response: any) => {
          this.name = response.name;
        },
        error: (error: any) => {
          console.error('Error getting user name:', error);
        }
      });
    } else {
      console.error('Token is empty.');
    }
  }

  startVideoCall(): void {
    if (this.videoCallComponent) {
      this.videoCallComponent.startCall();
    } else {
      console.error('VideoCallComponent is not loaded');
    }
  }

  endVideoCall(): void {
    if (this.videoCallComponent) {
      this.videoCallComponent.endCall();
    } else {
      console.error('VideoCallComponent is not loaded');
    }
  }
}
