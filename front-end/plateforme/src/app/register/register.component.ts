import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { passwordComplexityValidator } from '../utils/validators';
import { emailFormatValidator, emailUniqueValidator, loginUniqueValidator, loginValidator } from '../utils/validators';
import { AuthService } from '../auth.service';



interface FormData {
  e_mail?: string;
  login?: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      e_mail: ['', [Validators.required, Validators.email, emailFormatValidator()], [emailUniqueValidator(this.checkEmailExistence.bind(this))]],
      login: ['', [
        Validators.required,
        Validators.minLength(5),
        loginValidator()
      ], [loginUniqueValidator(this.checkLoginExistence.bind(this))]],
      password: ['', [Validators.required, Validators.minLength(12), passwordComplexityValidator()]],
      name: ['', Validators.required],
      role: ['', Validators.required] // Добавляем валидацию на обязательное поле
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
    console.log("hello");
    this.attemptedSubmit = true;

    console.log('Валидность формы:', this.registerForm.valid);
    console.log('Форма имеет ошибки:', this.registerForm.errors);

  // Перед условием проверки на существование email и login
  console.log('Email существует:', this.emailExists);
  console.log('Login существует:', this.loginExists);

  if (this.registerForm.invalid) {
    console.error('Форма невалидна');
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

      this.authService.register(formData).subscribe({
        next: (response) => {
          if (response === null) {
            console.error('Ответ сервера null');
          } else if (response.error) {
            if (response.error === 'Such an email already exists, please use another email.') {
              this.emailExists = true;
            } else {
              console.error('Ошибка:', response.error);
            }
          } else {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/confirmation']);
          }
        },
        error: (err) => {
          console.error('Ошибка при обращении к серверу:', err);
        }
      });

  } else {
    console.error('Форма невалидна:', this.registerForm.errors);
  }
}
}

