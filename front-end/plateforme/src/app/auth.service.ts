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
    return this.http.post<any>(`${this.apiUrl}/login.php`, {e_mail: email, password })
    .pipe(
      tap(response => {
        console.log('Ответ от сервера на логин:', response)
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

  // getUserRole(): Observable<string | null> {
  //   const token = this.getToken();
  //   if (!token) {
  //     // Можно использовать of(null) из RxJS для создания Observable, который сразу завершится с null,
  //     // если это приемлемо для вашей логики обработки отсутствия токена.
  //     // Это позволит сохранить ваш интерфейс возвращаемого типа Observable<string | null>.
  //     return of(null);
  //   }
  //   const role = localStorage.getItem('userRole');
  //   return of(role);
  // }

  saveUserRole(role: string): void {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Случилась ошибка на стороне клиента или сети
      console.error('An error occurred:', error.error.message);
    } else {
      // Сервер вернул код состояния ошибки
      console.error(`Server returned code ${error.status}, ` +
                    `body was: ${error.error}`);
    }
    // Вернуть Observable с пользовательским сообщением об ошибке
    return throwError(() => new Error('Something bad happened; please try again later.'));
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

