import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BusinessService } from 'src/app/services/business-service/business.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent {
  constructor(private businessService: BusinessService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.params.subscribe((params: Params) => {
      console.log(params['id'])
      this.businessService.getRecruiter(params['id']).subscribe((res)=>{
        console.log(res)
      })
    })
  }
}
