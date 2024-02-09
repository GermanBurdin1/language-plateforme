import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://learn-lang-platform.local/back-end/end-points';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, {e_mail: email, password });
  }

  register(userDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register.php`, userDetails);
  }

  getDashboardData(): Observable<any> {
    // Тут предполагается, что токен уже сохранен в сервисе или localStorage
    const token = this.getToken();
    return this.http.get<any>(`${this.apiUrl}/dashboard.php`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Добавьте метод для получения сохраненного токена
  private getToken(): string | null {
    // Получение токена из localStorage или вашего сервиса
    return localStorage.getItem('token');
  }
}

