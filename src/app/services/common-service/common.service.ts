import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
    private engineerData = new Subject<any>(); //need to create a subject

    sendUpdate(data: any) { //the component that wants to update something, calls this fn
        this.engineerData.next(data); //next() will feed the value in Subject
    }

    getUpdate(): Observable<any> { //the receiver component calls this function
        return this.engineerData.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }
}
