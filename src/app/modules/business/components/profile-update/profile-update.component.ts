import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business-service/business.service';
import { CloudinaryService } from 'src/app/services/cloudinary/cloudinary.service';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
})
export class ProfileUpdateComponent {
  profileForm!: FormGroup;
  imageSrc: string = '';
  imgFile: string;
  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private router: Router,
    private auth: AuthService,
    private cloudinary: CloudinaryService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: ['', Validators.required],
      linkedIn: ['', Validators.required],
      website: ['', Validators.required],
      bio: ['', Validators.required],
      logo: ['', Validators.required],
      role: ['', Validators.required],
    });

    this.getMyProfile();
  }

  onFileChange(event: any) {
    // getting an image and setting global variable imgFile
    const file = event.target.files[0];
    this.imgFile = file
    var reader = new FileReader();
    reader.readAsDataURL(file);
    // File Preview
    reader.onload = (event: any) => {
      // setting a preview image without submitting
      this.imageSrc = event.target.result;
    };
  }

  submit() {
    const formData = new FormData();
    console.log(this.imgFile)
    formData.append("file", this.imgFile);
    formData.append("upload_preset", "yakyhtcu");

    this.cloudinary.uploadImg(formData).subscribe((res)=>{
      const data = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        company: this.profileForm.value.company,
        linkedIn: this.profileForm.value.linkedIn,
        website: this.profileForm.value.website,
        bio: this.profileForm.value.bio,
        logo: res.secure_url,
        role: this.profileForm.value.role,
      }
      this.businessService.updateRecruiter(data).subscribe({
        next: (response: any) => {
          console.log(response)
          this.router.navigate(['/business/details']);
        },
        error: (error) => {
          console.log(error);
        },
      });
    })
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
          logo: profile.user.Logo,
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
