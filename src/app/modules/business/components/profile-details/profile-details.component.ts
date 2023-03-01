import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BusinessService } from 'src/app/services/business-service/business.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent {
  recruiter:any;
  constructor(private businessService: BusinessService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.businessService.getRecruiter(params['id']).subscribe((res)=>{
        this.recruiter = res.recruiter
        console.log(this.recruiter)
      })
    })
  }
}
