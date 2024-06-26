import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

interface Person {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  availableTimes?: string[];
}

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  teachers: Person[] = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadTeachers();
  }

  loadTeachers() {
    this.http.get<Person[]>('http://learn-lang-platform.local/back-end/api/getUsers.php?role=teacher').subscribe({
      next: (data) => {
        this.teachers = data.filter(person => person.role === 'teacher');
      },
      error: (error) => {
        console.error('Error loading teachers', error);
      }
    });
  }

  bookLesson(teacher: Person, time: string) {
    const bookingData = {
      teacher_id: teacher.id,
      student_id: 1, // Пример: идентификатор текущего студента
      lesson_time: time
    };

    this.http.post('http://learn-lang-platform.local/back-end/api/bookLesson.php', bookingData).subscribe({
      next: (response) => {
        this.openConfirmationDialog('Vous avez bien réservé votre cours!');
      },
      error: (error) => {
        console.error('Error booking lesson', error);
      }
    });
  }

  openConfirmationDialog(message: string) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: message
      }
    });
  }
}
