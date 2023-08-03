import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { updateObjectForHeader } from 'src/app/models/header-data';

@Injectable({ providedIn: 'root' })
export class CommonService {
  private updatedUsersDataForHeader = new Subject<updateObjectForHeader>();
  private emailPasswordCredentials = new Subject<any>();

  updatedUserDataForHeader$ = this.updatedUsersDataForHeader.asObservable();
  emailPasswordCredentials$ = this.emailPasswordCredentials.asObservable();

  updateUsersDataForHeader = (data: updateObjectForHeader) => this.updatedUsersDataForHeader.next(data)
  updateEmailPasswordCredentials = (data: any) => this.emailPasswordCredentials.next(data)

}
