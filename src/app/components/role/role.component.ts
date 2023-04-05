import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {
  constructor(private auth: AuthService, private router: Router){}
  ngOnInit(): void {
    this.auth.getMyProfile().subscribe({
      next:(res)=> {
        if(res.type === "recruiter"){
          this.router.navigate(["/engineers"])
        }
      }
    })
  }
}
