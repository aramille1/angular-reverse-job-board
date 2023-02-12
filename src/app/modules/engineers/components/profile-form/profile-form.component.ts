import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
  constructor(private sanitizer: DomSanitizer){}
  imageSrc: string = "";
  coverImg: string = "";

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    hero: new FormControl('', Validators.required),
    city: new FormControl(''),
    state: new FormControl(''),
    country: new FormControl(''),
    avatar: new FormControl(null),
    coverImg: new FormControl(''),
    bio: new FormControl(''),

    searchStatus: new FormGroup({
      activelylooking: new FormControl(false),
      open: new FormControl(false),
      notinterested: new FormControl(false),
      invisible: new FormControl(false),
    }),

    roleType: new FormGroup({
      partTime: new FormControl(false),
      fullTimeContract: new FormControl(false),
      fullTimeEmployment:new FormControl(false),
    }),

    roleLevel: new FormGroup({
      junior: new FormControl(false),
      middle: new FormControl(false),
      senior: new FormControl(false),
      principal: new FormControl(false),
      cLevel: new FormControl(false),
    }),
    website: new FormControl(''),
    github: new FormControl(''),
    twitter: new FormControl(''),
    linkedin: new FormControl(''),
    stackoverlow: new FormControl(''),

  })

  submit(){
    console.log(this.profileForm.value);
  }



    onFileChange(event:any) {
      const file = event.target.files[0];
      this.profileForm.patchValue({
        avatar: file
      });
      var reader = new FileReader();
      reader.readAsDataURL(file)
        // File Preview
      reader.onload = (event: any) => {
        this.imageSrc = event.target.result
      }

    }

    onCoverFileChange(event:any) {
      const file = event.target.files[0];
      this.profileForm.patchValue({
        coverImg: file
      });
      var reader = new FileReader();

      reader.readAsDataURL(file)

        // File Preview
      reader.onload = (event: any) => {
        this.coverImg = event.target.result
      }

    }

}
