import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
    private engineerData = new Subject<any>();
    private businessData = new Subject<any>();
    private userId = new Subject<string>();
    private userData = new Subject<Object>();

    updateUserData(data: Object) {
      this.userData.next(data);
  }

  getUserData(): Observable<any> {
    return this.userData.asObservable();
}

// TODO clean up here


    sendUpdateEngineer(data: any) {
        this.engineerData.next(data);
    }
    sendUpdateBusiness(data: any) {
      this.businessData.next(data);
  }


    getUpdateEngineer(): Observable<any> { //the receiver component calls this function
        return this.engineerData.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }
    getUpdateBusiness(): Observable<any> { //the receiver component calls this function
      return this.businessData.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

}
