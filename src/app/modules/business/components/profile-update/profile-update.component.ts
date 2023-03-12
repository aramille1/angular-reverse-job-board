import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/services/business-service/business.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent {
  profileForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private commonService: CommonService,
    private router: Router
    ){}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: ['', Validators.required],
      linkedIn: ['', Validators.required],
      website: ['', Validators.required],
      bio: ['', Validators.required],
      // logo: [''],
      role: ['', Validators.required],
    })
  }

  submit(){
    console.log(this.profileForm.value);
    this.businessService.createRecruiter(this.profileForm.value).subscribe({
      next: (response: any) => {
        console.log(response);
        this.commonService.sendUpdateBusiness(response.recruiterId)
        this.router.navigate(['/engineers'])
      },
      error: (error) => {
        console.log(error);
      },

    })
  }
}
// TODO fetch to GET recruiter/me and show data here
