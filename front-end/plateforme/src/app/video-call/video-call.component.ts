import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  localTracks: {
    videoTrack: any | null,
    audioTrack: any | null
  } = {
    videoTrack: null,
    audioTrack: null
  };
  remoteUsers = {};
  appId = 'a020b374553e4fac80325223fba38531'; // Замените на ваш App ID
  channelName = 'rtc_token'; // Замените на имя вашего канала
  token = ''; // Токен будет получен из сервиса
  remoteVideos: ElementRef[] = [];

  @Output() callStarted = new EventEmitter<void>();
  @Output() callEnded = new EventEmitter<void>();

  constructor(private tokenService: TokenService) {}

  // Удален вызов joinChannel из ngOnInit
  ngOnInit(): void {
    // Инициализацию можно оставить пустой или использовать для других целей
  }

  // Объявлены как public, чтобы дать возможность вызывать их из TeacherDashboardComponent
  public async startCall(): Promise<void> {
    try {
      // Получаем токен из сервиса перед подключением к каналу
      this.token = await this.tokenService.getToken(this.channelName);
      await this.joinChannel();
      this.callStarted.emit();
    } catch (error) {
      console.error('Failed to start call', error);
    }
  }

  public async endCall(): Promise<void> {
    try {
      await this.leaveChannel();
      this.callEnded.emit();
    } catch (error) {
      console.error('Failed to end call', error);
    }
  }

  private async joinChannel(): Promise<void> {
    if (!this.token) {
      throw new Error('Token is not available for joining channel.');
    }
    this.localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    this.localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();

    if (this.localVideo.nativeElement) {
      this.localTracks.videoTrack.play(this.localVideo.nativeElement);
    }

    await this.agoraClient.join(this.appId, this.channelName, this.token);

    // Публикация локального видеопотока
    await this.agoraClient.publish(Object.values(this.localTracks));
    console.log('Publish success');

    this.agoraClient.on('user-published', async (user, mediaType) => {
      await this.agoraClient.subscribe(user, mediaType);
      console.log('Subscribe success');

      if (mediaType === 'video' && user.videoTrack) {
        // Теперь мы проверяем, что user.videoTrack определен
        const remoteVideoTrack = user.videoTrack;

        const videoElement = document.createElement('video');
        document.body.appendChild(videoElement); // или добавьте в другой элемент в DOM
        remoteVideoTrack.play(videoElement);

        this.remoteVideos.push(new ElementRef(videoElement));
      }

      if (mediaType === 'audio' && user.audioTrack) {
        // Аналогичная проверка для audioTrack
        user.audioTrack.play();
      }
    });

    this.agoraClient.on('user-unpublished', (user) => {
      // Удаление видеоэлемента удаленного пользователя
      const index = this.remoteVideos.findIndex(x => x.nativeElement.id === `video_${user.uid}`);
      if (index !== -1) {
        this.remoteVideos[index].nativeElement.remove();
        this.remoteVideos.splice(index, 1);
      }
    });
  }

  private async leaveChannel(): Promise<void> {
    // Отключение всех локальных треков
    this.localTracks.videoTrack?.close();
    this.localTracks.audioTrack?.close();

    // Отписка от всех удаленных пользователей и выход из канала
    this.agoraClient.remoteUsers.forEach((user) => {
      this.agoraClient.unsubscribe(user);
    });
    await this.agoraClient.leave();

    console.log('Client leaves channel');
  }

}
