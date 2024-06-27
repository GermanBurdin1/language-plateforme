import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://learn-lang-platform.local/back-end/end-points';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login.php`, { e_mail: email, password })
      .pipe(
        tap(response => {
          console.log('Ответ от сервера на логин:', response);
          if (response.token && response.role) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
            localStorage.setItem('Id_person', response.Id_person);
            console.log('Auth.service:Токен и роль сохранены в localStorage');
          } else {
            console.error('Не удалось получить токен или роль из ответа');
          }
        }),
        catchError(this.handleError)
      );
  }

  register(userDetails: any): Observable<any> {
    console.log('Регистрация пользователя с данными:', userDetails);
    return this.http.post<any>(`${this.apiUrl}/register.php`, userDetails)
      .pipe(
        tap(response => console.log('Ответ от сервера на регистрацию:', response)),
        catchError(error => {
          console.error('Произошла ошибка при регистрации:', error);
          return this.handleError(error);
        })
      );
  }

  getDashboardData(): Observable<any> {
    const token = this.getToken();
    return this.http.get<any>(`${this.apiUrl}/dashboard.php`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .pipe(
      catchError(this.handleError)
    );
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

  getUserRole(token: string): Observable<any> {
    const getUserUrl = 'http://learn-lang-platform.local/back-end/end-points/user-details/getUserRole.php';
    return this.http.get<any>(getUserUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Server returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('Id_person');
  }
}
