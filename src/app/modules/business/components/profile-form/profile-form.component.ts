import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
  profileForm!: FormGroup;
  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      website: ['', Validators.required],
      bio: ['', Validators.required],
      logo: ['', Validators.required],
      name: ['', Validators.required],
      role: ['', Validators.required],
    })
  }

  submit(){
    console.log(this.profileForm);
  }
}
