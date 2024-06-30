import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../../auth.service';
import { VideoCallComponent } from '../../../../../video-call/video-call.component';

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss']
})
export class PersonalCabinetComponent implements OnInit {
  name: string = '';
  token: string | null = null;

  @ViewChild(VideoCallComponent) videoCallComponent!: VideoCallComponent;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
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
