import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

interface Person {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  availableTimes?: { date: string, time: string }[];
}

interface Lesson {
  teacherName: string;
  date: string;
  time: string;
}

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
  teachers: Person[] = [];
  lessons: Lesson[] = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadTeachers();
    this.loadLessons();
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

  loadLessons() {
    this.http.get<Lesson[]>('http://learn-lang-platform.local/back-end/api/getLessons.php').subscribe({
      next: (data) => {
        this.lessons = data;
      },
      error: (error) => {
        console.error('Error loading lessons', error);
      }
    });
  }

  bookLesson(teacher: Person, date: string, time: string) {
    const bookingData = {
      teacher_id: teacher.id,
      student_id: 1, // Пример: идентификатор текущего студента
      lesson_time: `${date} ${time}`
    };

    this.http.post('http://learn-lang-platform.local/back-end/api/bookLesson.php', bookingData).subscribe({
      next: (response) => {
        this.openConfirmationDialog('Vous avez bien réservé votre cours!');
        this.loadLessons();
        this.updateTeacherAvailability(teacher.id, date, time);
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

  updateTeacherAvailability(teacherId: number, date: string, time: string) {
    const teacher = this.teachers.find(t => t.id === teacherId);
    if (teacher) {
      teacher.availableTimes = teacher.availableTimes?.filter(t => t.date !== date || t.time !== time);
    }
  }
}
