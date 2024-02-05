import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';


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
  emailExists = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      e_mail: ['', [Validators.required, Validators.email]],
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.registerForm.get('login')?.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(value => this.checkLoginExistence(value))
    ).subscribe(exists => {
      this.loginExists = exists;
      this.registerForm.controls['login'].setErrors(exists ? { 'loginExists': true } : null);
    });

    this.registerForm.get('e_mail')?.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(value => this.checkEmailExistence(value))
    ).subscribe(exists => {
      this.emailExists = exists;
      this.registerForm.controls['e_mail'].setErrors(exists ? { 'emailExists': true } : null);
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
    if (this.registerForm.valid) {
      let formData: FormData = {
        e_mail: this.registerForm.value.e_mail,
        login: this.registerForm.value.login,
        password: this.registerForm.value.password,
        name: this.registerForm.value.name
      };

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post('http://learn-lang-platform.local/back-end/AngularRequestsHandler.php', formData, { headers }).subscribe({
        next: (response) => {
          console.log('Успех:', response);
          this.router.navigate(['/confirmation']);
        },
        error: (error) => {
          console.error('Ошибка:', error);
        }
      });
    } else {
      console.error('Форма невалидна:', this.registerForm.errors);
    }
  }
}

