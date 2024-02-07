import { AbstractControl, ValidationErrors, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, map, catchError, switchMap } from 'rxjs/operators';

export function passwordComplexityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /\d+/.test(value);
    const hasSpecial = /[\W_]+/.test(value);

    const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;
    return isValid ? null : { 'passwordComplexity': true };
  };
}

export function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const emailFormatPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailFormatPattern.test(value) ? null : { 'emailFormat': true };
  };
}

export function emailUniqueValidator(checkEmailExistence: (e_mail: string) => Observable<boolean>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const e_mail = control.value;
    if (!e_mail) {
      return of(null); // Если поле пустое, не выполняем проверку
    }

    // Выполняем запрос к серверу, чтобы проверить уникальность e-mail
    return checkEmailExistence(e_mail).pipe(
      map(exists => (exists ? { emailExists: true } : null)), // Если e-mail уже существует, возвращаем ошибку
      catchError(() => of(null))
    );
  };
}

export function loginUniqueValidator(checkLoginExistence: (login: string) => Observable<boolean>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const login = control.value;
    if (!login) {
      return of(null); // Если поле пустое, не выполняем проверку
    }

    // Выполняем запрос к серверу, чтобы проверить уникальность login
    return checkLoginExistence(login).pipe(
      map(exists => (exists ? { loginExists: true } : null)), // Если login уже существует, возвращаем ошибку
      catchError(() => of(null))
    );
  };
}