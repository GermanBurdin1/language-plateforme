import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentProfileService {
  private apiUrl = 'http://learn-lang-platform.local/back-end/end-points/user-details/student-profile/create_or_update_student_profile.php';

  constructor(private http: HttpClient) { }

  createOrUpdateProfile(profileData: any): Observable<any> {
    return this.http.post(this.apiUrl, profileData);
  }
}
