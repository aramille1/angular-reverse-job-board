import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent {
  engineer: any;
  userIsMe: Boolean;
  constructor(private auth: AuthService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.userIsMe = localStorage.getItem('engineerId') === params['id']
      this.auth.getProfileDetails(params['id']).subscribe((res: any) => {
        console.log(res.engineer)
        this.engineer = res.engineer;
      });
    });
  }
}
