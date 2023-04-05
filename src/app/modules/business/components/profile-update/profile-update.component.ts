import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business-service/business.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
})
export class ProfileUpdateComponent {
  profileForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private router: Router,
    private auth: AuthService
  ) {}

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
    });

    this.getMyProfile();
  }

  submit() {
    this.businessService.updateRecruiter(this.profileForm.value).subscribe({
      next: (response: any) => {
        console.log(response)
        this.router.navigate(['/business/details']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getMyProfile() {
    this.auth.getMyProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          firstName: profile.user.Firstname,
          lastName: profile.user.Lastname,
          company: profile.user.Company,
          linkedIn: profile.user.LinkedIn,
          website: profile.user.Website,
          bio: profile.user.Bio,
          role: profile.user.Role,
        });
        this.profileForm.controls['linkedIn'].disable();
      },
      error: (error) => {
        error.log(error);
      },
    });
  }
}
