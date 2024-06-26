import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HomeComponent } from './home/home.component';
import { DashboardTeacherComponent } from './dashboard/dashboard-teacher.component';
import { VideoCallComponent } from './video-call/video-call.component';
import { DashboardStudentComponent } from './dashboard/student/dashboard-student.component';
import { DictionaryComponent } from './dashboard/student/features/dictionary/dictionary.component';
import { SettingsComponent } from './dashboard/student/features/settings/settings.component';
import { LessonsComponent } from './dashboard/student/features/lessons/lessons.component';
import { StudentSettingsComponent } from './dashboard/student/student-info/student-settings/student-settings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyPageComponent } from './dashboard/student/features/myPage/my-page/my-page.component';
import { PhotosComponent } from './dashboard/student/features/myPage/photos/photos.component';
import { ChatComponent } from './dashboard/student/features/myPage/chat/chat.component';
import { WordComponent } from './dashboard/student/features/dictionary/word/word.component';

// Import Angular Material modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

// Import ConfirmationDialogComponent
import { ConfirmationDialogComponent } from './dashboard/student/features/lessons/confirmation-dialog/confirmation-dialog.component'

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ConfirmationComponent,
    HomeComponent,
    DashboardTeacherComponent,
    VideoCallComponent,
    DashboardStudentComponent,
    DictionaryComponent,
    SettingsComponent,
    LessonsComponent,
    StudentSettingsComponent,
    MyPageComponent,
    PhotosComponent,
    ChatComponent,
    WordComponent,
    ConfirmationDialogComponent, // Add the confirmation dialog component
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // Required for Angular Material
    MatDialogModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
 // Add entryComponents for the dialog
})
export class AppModule { }
