import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

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
      student_id: 1,
      lesson_time: time
    };

    this.http.post('/api/lessons', bookingData).subscribe({
      next: (response) => {
        console.log('Lesson booked successfully', response);
      },
      error: (error) => {
        console.error('Error booking lesson', error);
      }
    });
  }
}

