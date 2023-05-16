import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { updateObjectForHeader } from 'src/app/models/header-data';

@Injectable({ providedIn: 'root' })
export class CommonService {
  private updatedUsersDataForHeader = new Subject<updateObjectForHeader>();

  updatedUserDataForHeader$ = this.updatedUsersDataForHeader.asObservable();

  updateUsersDataForHeader = (data: updateObjectForHeader) => this.updatedUsersDataForHeader.next(data)
}
