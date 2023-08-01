import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'environments/environments';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  url = environment.apiUrl;
  userID: any
  verificationCode: any
  constructor(private route: ActivatedRoute, private http: HttpClient) { }
  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get('id')
    this.verificationCode = this.route.snapshot.paramMap.get('verificationCode')

    this.http.get(`${this.url}/verify/{userID}/{verificationCode}`).subscribe({
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
