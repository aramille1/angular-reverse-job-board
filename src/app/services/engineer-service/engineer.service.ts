import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from '../common-service/common.service';

@Injectable({
  providedIn: 'root',
})
export class EngineerService {
  constructor(private commonService: CommonService, private http: HttpClient, private router: Router) {}

  createEngineer(profileFormData: any) {
    if (profileFormData) {
      this.http
        .post(
          'http://localhost:3000/engineers',
          JSON.stringify(profileFormData)
        )
        .subscribe(
          (response: any) => {
            console.log(response);
            this.commonService.sendUpdateEngineer(response.engineerId)
            localStorage.setItem('engineerId', response.engineerId);
            this.router.navigate(['engineers/details', response.engineerId]);
          },
          (error) => {
            console.log(error);
          },
          () => {
            console.log('done!');
          }
        );
    }
  }

  getEngineers(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/engineers');
  }

  getEngineer(engineerId: any): Observable<any> {
    return this.http.get(`http://localhost:3000/engineers/${engineerId}`);
  }

  updateProfile(engineer: any): Observable<any> {
    return this.http.put("http://localhost:3000/engineers/me", engineer);
  }

  getProfileToUpdate(id:any) {
    // const id = localStorage.getItem('engineerId');
    return this.http.get(`http://localhost:3000/engineers/${id}`);
  }

  getMyProfile(): Observable<any>{
    return this.http.get(`http://localhost:3000/engineers/me`);
  }
}
