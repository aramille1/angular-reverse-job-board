import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environments';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  loading: boolean = true;
  showError: boolean = false;
  url = environment.apiUrl;
  userID: any
  verificationCode: any
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,) { }
  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get('userID')
    this.verificationCode = this.route.snapshot.paramMap.get('verificationCode')

    this.http.get(`${this.url}/verify/${this.userID}/${this.verificationCode}`).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('email succefully verified')
      },
      error: err => {
        this.loading = false;
        this.showError = true;
        console.error(err)
        console.log('something went wrong with email verification');
      }
    })
  }
}
