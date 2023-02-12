import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    hero: new FormControl('', Validators.required),
    city: new FormControl(''),
    state: new FormControl(''),
    country: new FormControl(''),
    avatar: new FormControl(''),
    coverImg: new FormControl(''),
    bio: new FormControl(''),

  })

  submit(){
    console.log(this.profileForm);

  }
}
