import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent {
  engineer: any;
  userIsMe: Boolean;
  constructor(private engineerService: EngineerService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.engineerService.getEngineer(params['id']).subscribe((res: any) => {
        this.engineerService.getMyProfile().subscribe((res) =>{
          this.userIsMe = res.engineer.ID  === params['id']
        })
        this.engineer = res.engineer;
      });
    });

  }

}
