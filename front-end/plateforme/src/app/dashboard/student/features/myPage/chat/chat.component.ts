import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  messages: any[] = [];
  newMessage: string = '';

  constructor() { }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({
        user: 'Utilisateur',
        content: this.newMessage
      });
      this.newMessage = '';
    }
  }
}
