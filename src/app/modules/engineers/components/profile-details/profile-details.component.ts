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
      console.log("params id",params['id'])
      console.log(localStorage.getItem('engineerId'))
      console.log(this.userIsMe)
      this.engineerService.getEngineer(params['id']).subscribe((res: any) => {
        console.log("res", res.engineer)
        this.userIsMe = res.engineer.ID === params['id']
        console.log(this.userIsMe);

        this.engineer = res.engineer;
      });
    });
  }
}
