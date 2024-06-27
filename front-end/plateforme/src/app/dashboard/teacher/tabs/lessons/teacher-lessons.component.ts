import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { TeacherConfirmationDialogComponent } from './teacher-confirmation-dialog/teacher-confirmation-dialog.component';

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

interface Availability {
  available_date: string;
  available_time: string;
}

@Component({
  selector: 'app-lessons',
  templateUrl: './teacher-lessons.component.html',
  styleUrls: ['./teacher-lessons.component.scss']
})
export class TeacherLessonsComponent implements OnInit {
  teachers: Person[] = [];
  lessons: Lesson[] = [];
  newAvailability = { date: '', time: '' };
  teacherAvailability: Availability[] = [];

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadTeachers();
    this.loadLessons();
    this.loadTeacherAvailability(1);
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

  loadTeacherAvailability(teacherId: number) {
    this.http.get<Availability[]>(`http://learn-lang-platform.local/back-end/api/getTeacherAvailability.php?teacher_id=${teacherId}`).subscribe({
      next: (data) => {
        console.log('Teacher Availability:', data); // Отладочный вывод
        this.teacherAvailability = data;
      },
      error: (error) => {
        console.error('Error loading teacher availability', error);
      }
    });
  }


  addAvailability() {
    const availabilityData = {
      teacher_id: 1,  // Пример: идентификатор текущего преподавателя
      available_date: this.newAvailability.date,
      available_time: this.newAvailability.time
    };

    this.http.post('http://learn-lang-platform.local/back-end/api/addAvailability.php', availabilityData).subscribe({
      next: (response) => {
        this.openConfirmationDialog('Availability added successfully!');
        this.loadTeacherAvailability(1); // Перезагружаем доступность преподавателя после добавления
      },
      error: (error) => {
        console.error('Error adding availability', error);
      }
    });
  }

  openConfirmationDialog(message: string) {
    this.dialog.open(TeacherConfirmationDialogComponent, {
      data: {
        message: message
      }
    });
  }
}
