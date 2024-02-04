import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';

interface FormData {
  e_mail?: string;
  login?: string;
  password: string;
  name: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loginExists = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      emailOrLogin: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.registerForm.get('emailOrLogin')?.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(value => this.checkLoginExistence(value))
    ).subscribe(exists => {
      this.loginExists = exists;
      if (exists) {
        // Установка ошибки формы
        this.registerForm.controls['emailOrLogin'].setErrors({ 'loginExists': true });
      } else {
        // Очистка ошибки формы, если логин не существует
        this.registerForm.controls['emailOrLogin'].setErrors(null);
      }
    });
  }

  checkLoginExistence(login: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`http://learn-lang-platform.local/back-end/AngularRequestsHandler.php?login=${login}`)
      .pipe(map(response => response.exists));
  }

  onSubmit() {
    if (this.registerForm.valid) {
      let formData: FormData = {
        password: this.registerForm.value.password,
        name: this.registerForm.value.name
      };

      const emailOrLogin = this.registerForm.value.emailOrLogin;
      if (emailOrLogin.includes('@')) {
        formData.e_mail = emailOrLogin;
      } else {
        formData.login = emailOrLogin;
      }

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post('http://learn-lang-platform.local/back-end/AngularRequestsHandler.php', formData, { headers }).subscribe({
        next: (response) => console.log('Успех:', response),
        error: (error) => console.error('Ошибка:', error)
      });
    } else {
      console.error('Форма невалидна:', this.registerForm.errors);
    }
  }
}

