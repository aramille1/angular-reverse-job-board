import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
  private businessData = new Subject<Object>();
  private userData = new Subject<Object>();

  updateUserData(data: Object) {
    this.userData.next(data);
  }

  getUserData(): Observable<any> {
    return this.userData.asObservable();
  }

  updateRecruiterData(data: Object) {
    this.businessData.next(data);
  }
}
