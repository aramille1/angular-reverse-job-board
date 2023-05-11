import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private auth: AuthService){}
  title = 'Angular talents';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log(localStorage['expires'])

    //   if((Math.floor((new Date).getTime() / 1000)) >= Number(localStorage.getItem('expires') && localStorage['expires']) !== undefined){
    //     this.auth.signout()
    //   }
  }
}
