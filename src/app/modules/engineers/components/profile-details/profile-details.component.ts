import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent {
  engineer: any;
  userIsMe: Boolean;
  recruiterIsMember: Boolean = false;
  constructor(
    private engineerService: EngineerService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.engineerService
        .getEngineer(params['id'])
        .subscribe((engineerFoundById: any) => {
          this.auth.getMyProfile().subscribe((myProfile) => {
            if(myProfile.type === "recruiter"){
              this.recruiterIsMember = myProfile.user.IsMember
            }
            if(myProfile.type === "engineer" && (myProfile.user.ID === params['id'])){
              this.engineer = myProfile.user
            }
            this.userIsMe = myProfile.user.ID === params['id'];
          });
          this.engineer = engineerFoundById.engineer;
        });
    });
  }
}
