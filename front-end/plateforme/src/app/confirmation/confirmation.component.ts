import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      this.authService.getUserRole(token).subscribe({
      next: (role) => {
        setTimeout(() => {
          if (role === 'student') {
            this.router.navigate(['/student-dashboard']);
          } else if (role === 'teacher') {
            this.router.navigate(['/teacher-dashboard']);
          }
        }, 3000);
      },
      error: (err) => {
        console.error('Error fetching user role', err);
      }
      });
    }
    else {
      console.log('Token is missing');
    }
}
}
