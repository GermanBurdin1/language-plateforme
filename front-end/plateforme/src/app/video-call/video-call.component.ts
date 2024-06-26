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
  appId = 'a020b374553e4fac80325223fba38531';
  channelName = 'rtc_token';
  token = '';
  remoteVideos: ElementRef[] = [];

  @Output() callStarted = new EventEmitter<void>();
  @Output() callEnded = new EventEmitter<void>();

  constructor(private tokenService: TokenService) {}

  ngOnInit(): void {

  }


  public async startCall(): Promise<void> {
    try {
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


    await this.agoraClient.publish(Object.values(this.localTracks));
    console.log('Publish success');

    this.agoraClient.on('user-published', async (user, mediaType) => {
      await this.agoraClient.subscribe(user, mediaType);
      console.log('Subscribe success');

      if (mediaType === 'video' && user.videoTrack) {

        const remoteVideoTrack = user.videoTrack;

        const videoElement = document.createElement('video');
        document.body.appendChild(videoElement);
        remoteVideoTrack.play(videoElement);

        this.remoteVideos.push(new ElementRef(videoElement));
      }

      if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.play();
      }
    });

    this.agoraClient.on('user-unpublished', (user) => {
      const index = this.remoteVideos.findIndex(x => x.nativeElement.id === `video_${user.uid}`);
      if (index !== -1) {
        this.remoteVideos[index].nativeElement.remove();
        this.remoteVideos.splice(index, 1);
      }
    });
  }

  private async leaveChannel(): Promise<void> {
    this.localTracks.videoTrack?.close();
    this.localTracks.audioTrack?.close();

    this.agoraClient.remoteUsers.forEach((user) => {
      this.agoraClient.unsubscribe(user);
    });
    await this.agoraClient.leave();

    console.log('Client leaves channel');
  }

}
