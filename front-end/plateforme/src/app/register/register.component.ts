import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { passwordComplexityValidator } from '../utils/validators';
import { emailFormatValidator, emailUniqueValidator, loginUniqueValidator, loginValidator } from '../utils/validators';



interface FormData {
  e_mail?: string;
  login?: string;
  password: string;
  name: string;
  role: string; // Add this line
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loginExists = false;
  emailExists = false;
  attemptedSubmit = false;
  passwordExists = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      e_mail: ['', [Validators.required, Validators.email, emailFormatValidator()], [emailUniqueValidator(this.checkEmailExistence.bind(this))]],
      login: ['', [
        Validators.required,
        Validators.minLength(5),
        loginValidator()
      ], [loginUniqueValidator(this.checkLoginExistence.bind(this))]],
      password: ['', [Validators.required, Validators.minLength(12), passwordComplexityValidator()]],
      name: ['', Validators.required],
      role: ['', Validators.required] // Add this line
    });
  }

  ngOnInit() {
    this.registerForm.get('login')?.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(value => this.checkLoginExistence(value))
    ).subscribe(exists => {
      this.loginExists = exists;
      this.registerForm.controls['login'].updateValueAndValidity();
    });

    this.registerForm.get('e_mail')?.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(value => this.checkEmailExistence(value))
    ).subscribe(exists => {
      this.emailExists = exists;
      this.registerForm.controls['e_mail'].updateValueAndValidity();
    });
  }

  checkLoginExistence(login: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`http://learn-lang-platform.local/back-end/AngularRequestsHandler.php?login=${login}`)
      .pipe(map(response => response.exists));
  }

  checkEmailExistence(e_mail: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`http://learn-lang-platform.local/back-end/AngularRequestsHandler.php?e_mail=${e_mail}`)
      .pipe(map(response => response.exists));
  }

  onSubmit() {
    this.attemptedSubmit = true;

    if (this.registerForm.invalid) {
      // Обработка ошибок
      return;
    }
    if (this.registerForm.valid && !this.emailExists && !this.loginExists) {
      let formData: FormData = {
        e_mail: this.registerForm.value.e_mail,
        login: this.registerForm.value.login,
        password: this.registerForm.value.password,
        name: this.registerForm.value.name,
        role: this.registerForm.value.role
      };

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post<any>('http://learn-lang-platform.local/back-end/AngularRequestsHandler.php', formData, { headers }).subscribe({
        next: (response) => {
          if (response.error) {
            if (response.error === 'Such an email already exists, please use another email.') {
              this.emailExists = true;
            } else {
              console.error('Ошибка:', response.error);
            }
          } else {
            // Перенаправление на страницу подтверждения
            console.log('Успех:', response);
            this.router.navigate(['/confirmation']);
          }
        },
        error: (error) => {
          console.error('Ошибка при отправке данных:', error);
        }
      });
  } else {
    console.error('Форма невалидна:', this.registerForm.errors);
  }
}
}

