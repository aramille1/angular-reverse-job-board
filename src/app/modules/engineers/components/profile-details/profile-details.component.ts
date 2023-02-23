import { Engineer } from 'src/app/engineer';
import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent {
  engineer: any
  constructor(private auth: AuthService, private route: ActivatedRoute) { }
  ngOnInit(): void {

  this.route.params.subscribe((params:Params) => {
    console.log(typeof params['id'])
    this.auth.getProfile(params['id']).subscribe((res:any)=>{
      console.log(res.engineer)
      this.engineer = res.engineer
      console.log(this.engineer)
    })
  })
}
}
