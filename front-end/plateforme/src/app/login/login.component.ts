import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Le formulaire de connexion est valide, envoi de la demande au serveur');
      this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            const token = localStorage.getItem('token');
            console.log('Jeton reçu :', token);
            if (token) {
              this.authService.getUserRole(token).subscribe({
                next: (roleResponse) => {
                  const role = roleResponse.role.trim().toLowerCase();
                  console.log('Rôle de l’utilisateur reçu :', role);
                  if (role === 'student') {
                    console.log('Redirection vers /dashboard-student');
                    this.router.navigate(['/dashboard-student']);
                  } else if (role === 'teacher') {
                    console.log('Redirection vers /dashboard-teacher');
                    this.router.navigate(['/dashboard-teacher']);
                  } else {
                    console.error('Rôle inconnu :', role);
                  }
                },
                error: (err) => {
                  console.error('Erreur lors de la récupération du rôle de l’utilisateur :', err);
                }
              });
            } else {
              console.error('Jeton absent après la connexion');
            }
          } else {
            console.error('Rôle inconnu ou absent');
          }
        },
        error: (err) => {
          console.error('Erreur lors de la connexion :', err);
        }
      });
    } else {
      console.error('Le formulaire de connexion est invalide');
    }
  }
}
