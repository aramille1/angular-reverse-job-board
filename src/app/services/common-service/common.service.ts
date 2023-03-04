import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
    private engineerData = new Subject<any>();
    private businessData = new Subject<any>();
    private userId = new Subject<string>();

    sendUpdateEngineer(data: any) { //the component that wants to update something, calls this fn
        this.engineerData.next(data); //next() will feed the value in Subject
    }
    sendUpdateBusiness(data: any) { //the component that wants to update something, calls this fn
      this.businessData.next(data); //next() will feed the value in Subject
  }

  sendUpdateUserId(userId: string) { //the component that wants to update something, calls this fn
    this.userId.next(userId); //next() will feed the value in Subject
  }

    getUpdateEngineer(): Observable<any> { //the receiver component calls this function
        return this.engineerData.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }
    getUpdateBusiness(): Observable<any> { //the receiver component calls this function
      return this.businessData.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  getUpdateUserId(): Observable<string> { //the receiver component calls this function
    return this.userId.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
}
}
