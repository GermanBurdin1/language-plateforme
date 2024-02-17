import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HomeComponent } from './home/home.component';
import { DashboardTeacherComponent } from './dashboard/dashboard-teacher.component'
import { VideoCallComponent } from './video-call/video-call.component';
import { DashboardStudentComponent } from './dashboard/student/dashboard-student.component';
import { LessonsComponent } from './dashboard/features/lessons/lessons.component';
import { DictionaryComponent } from './dashboard/features/dictionary/dictionary.component';
import { SettingsComponent } from './dashboard/features/settings/settings.component';
import { StudentSettingsComponent } from './dashboard/student-info/student-settings/student-settings.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard-teacher', component: DashboardTeacherComponent },
  { path: 'dashboard-student', component: DashboardStudentComponent,children: [
    { path: 'lessons', component: LessonsComponent },
    { path: 'dictionary', component: DictionaryComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'student-settings', component: StudentSettingsComponent },
  ] },
  { path: 'video-call', component: VideoCallComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

