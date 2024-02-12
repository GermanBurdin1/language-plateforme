import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HomeComponent } from './home/home.component';
import { TeacherDashboardComponent } from './dashboard/teacher-dashboard.component'
import { VideoCallComponent } from './video-call/video-call.component';
import { StudentDashboardComponent } from './dashboard/student-dashboard.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: TeacherDashboardComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'video-call', component: VideoCallComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

