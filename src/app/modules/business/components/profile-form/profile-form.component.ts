import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/services/business-service/business.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
  profileForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
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
        this.router.navigate(['business/details', response.recruiterId])
      },
      error: (error) => {
        console.log(error);
      },

    })
  }
}
