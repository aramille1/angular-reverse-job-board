import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/services/business-service/business.service';
import { CloudinaryService } from 'src/app/services/cloudinary/cloudinary.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
  profileForm!: FormGroup;
  imageSrc: string = '';
  imgFile: string;
  showError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private commonService: CommonService,
    private router: Router,
    private cloudinary: CloudinaryService
    ){}

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
    })
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

  submit(){
    const formData = new FormData();
    console.log(this.imgFile)
    formData.append("file", this.imgFile);
    formData.append("upload_preset", "yakyhtcu");

    this.cloudinary.uploadImg(formData).subscribe({
      next: (res) =>{
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

        this.businessService.createRecruiter(data).subscribe({
          next: (response: any) => {
            console.log(response);
            this.commonService.updateRecruiterData(response.recruiterId)
            this.router.navigate(['/engineers'])
          },
          error: (error) => {
            this.showError = true
            console.error(error);
          },

        })
      },
      error: (err) =>{
        this.showError = true
        console.error(err);
      }
    })
  }
}
