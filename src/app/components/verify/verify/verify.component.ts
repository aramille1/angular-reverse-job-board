import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environments';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  url = environment.apiUrl;
  userID: any
  verificationCode: any
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private commonService: CommonService) { }
  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get('userID')
    this.verificationCode = this.route.snapshot.paramMap.get('verificationCode')
    console.log('----------------');
    console.log('userID')
    console.log(this.userID);
    console.log('----------------');


    console.log('verificationCode')
    console.log(this.verificationCode);
    console.log('----------------');

    this.http.get(`${this.url}/verify/${this.userID}/${this.verificationCode}`).subscribe({
      next: (res) => {
        console.log(res)
        console.log('email succefully verified')



      },
      error: err => {
        console.error(err)
        console.log('something went wrong with email verification');
      }
    })



  }
}
