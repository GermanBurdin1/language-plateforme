import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError,firstValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://learn-lang-platform.local/back-end/end-points';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, {e_mail: email, password })
    .pipe(
      tap(response => {
        // Предположим, что ответ содержит поля token и role
        if (response.token && response.role) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          localStorage.setItem('Id_person', response.Id_person);
        }
      }),
      catchError(this.handleError)
    );
  }

  register(userDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register.php`, userDetails)
    .pipe(
      catchError(this.handleError)
    );;
  }

  getDashboardData(): Observable<any> {
    // Тут предполагается, что токен уже сохранен в сервисе или localStorage
    const token = this.getToken();
    return this.http.get<any>(`${this.apiUrl}/dashboard.php`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .pipe(
      catchError(this.handleError)
    );;
  }

  getUserName(token: string): Observable<any> {
    const getUserUrl = 'http://learn-lang-platform.local/back-end/end-points/user-details/getUserName.php';
    return this.http.get<any>(getUserUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Случилась ошибка на стороне клиента или сети
      console.error('An error occurred:', error.error.message);
    } else {
      // Сервер вернул код состояния ошибки
      console.error(`Server returned code ${error.status}, error message is: ${error.error}`);
    }
    // Вернуть наблюдаемый с пользовательским сообщением об ошибке
    return throwError('Something bad happened; please try again later.');
  }

  // Добавьте метод для получения сохраненного токена
  getToken(): string | null {
    // Получение токена из localStorage или вашего сервиса
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('Id_person');
  }
}

