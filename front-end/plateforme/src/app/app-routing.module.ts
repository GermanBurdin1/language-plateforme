import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HomeComponent } from './home/home.component';
import { DashboardTeacherComponent } from './dashboard/teacher/dashboard-teacher.component';
import { DashboardStudentComponent } from './dashboard/student/dashboard-student.component';
import { LessonsComponent } from './dashboard/teacher/tabs/lessons/lessons.component';
import { DictionaryComponent } from './dashboard/teacher/tabs/dictionary/dictionary.component';
import { TeacherSettingsComponent } from './dashboard/teacher/tabs/teacher-settings/teacher-settings.component';
import { MyPageComponent } from './dashboard/teacher/tabs/myPage/my-page/my-page.component';
import { PersonalCabinetComponent} from './dashboard/teacher/tabs/lessons/personal-cabinet/personal-cabinet.component';
import { VideoCallComponent } from './video-call/video-call.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard-teacher',
    component: DashboardTeacherComponent,
    children: [
      { path: 'my-page', component: MyPageComponent },
      { path: 'lessons', component: LessonsComponent, children: [
          { path: 'personal-cabinet', component: PersonalCabinetComponent, children: [
              { path: 'video-call', component: VideoCallComponent }
            ]}
        ]},
      { path: 'dictionary', component: DictionaryComponent },
      { path: 'settings', component: TeacherSettingsComponent }
    ]
  },
  {
    path: 'dashboard-student',
    component: DashboardStudentComponent,
    children: [
      { path: 'lessons', component: LessonsComponent },
      { path: 'dictionary', component: DictionaryComponent },
      { path: 'settings', component: TeacherSettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
