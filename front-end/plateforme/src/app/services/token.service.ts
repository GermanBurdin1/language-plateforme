import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private http: HttpClient) {}

  getToken(channelName: string): Promise<string> {
    const url = `http://learn-lang-platform.local/back-end/end-points/agora/generate_token.php?channelName=${channelName}`;
    // Используем firstValueFrom для преобразования Observable в Promise
    return firstValueFrom(
      this.http.get<{ token: string }>(url)
    ).then(response => response.token);
  }
}
