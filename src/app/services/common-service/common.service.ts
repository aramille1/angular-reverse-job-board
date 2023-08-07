import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { updateObjectForHeader } from 'src/app/models/header-data';

@Injectable({ providedIn: 'root' })
export class CommonService {
  private updatedUsersDataForHeader = new Subject<updateObjectForHeader>();
  private emailPasswordCredentials = new Subject<any>();
  private isVerified = new BehaviorSubject<boolean>(false);

  updatedUserDataForHeader$ = this.updatedUsersDataForHeader.asObservable();
  emailPasswordCredentials$ = this.emailPasswordCredentials.asObservable();
  isVerified$ = this.isVerified.asObservable();

  updateUsersDataForHeader = (data: updateObjectForHeader) => this.updatedUsersDataForHeader.next(data)
  updateEmailPasswordCredentials = (data: any) => this.emailPasswordCredentials.next(data)
  updateIsVerified = (value: boolean) => this.isVerified.next(value)

}
