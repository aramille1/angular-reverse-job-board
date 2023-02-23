import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Engineer } from 'src/app/engineer';
import { map } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-engineers',
  templateUrl: './engineers.component.html',
  styleUrls: ['./engineers.component.scss']
})
export class EngineersComponent {
  engineers = new Array<any>();

  constructor(private http: HttpClient, private auth: AuthService){}
  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe((res) => {
      console.log(res)
    })
    this.auth.getEngineers().subscribe(res => {
      console.log(res)
      this.engineers = res.engineers;
  });
  }
}
