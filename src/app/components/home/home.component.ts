import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { CommonService } from 'src/app/services/common-service/common.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  engineers = new Array<any>();
  tempEngineers = new Array<any>();
  loading: boolean = true;
  loader = this.loadingBar.useRef();
  private engineersSub: Subscription;
  imgObj: CloudinaryImage = new CloudinaryImage(); //needs to be initialized
  imgString: string = ''; //CloudinaryImage;
  constructor(
    private engineerService: EngineerService,
    private loadingBar: LoadingBarService,
    private commonService: CommonService,
    private auth: AuthService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.loader.start();
    console.log('isVerifed from commonService:', this.commonService.isVerifiedStatus);

    this.auth.signin(this.commonService.data).subscribe({
      next: (response) => {
        const parsedToken = JSON.parse(
          atob(response['auth_token'].split('.')[1])
        );
        localStorage.setItem('token', response['auth_token']);
        localStorage.setItem('expires', JSON.stringify(parsedToken.exp));
        this.auth.setIsLoggedIn(true);
        console.log('loggedin!');
        // this.auth.getMyProfile().subscribe({
        //   next: () => this.router.navigate(['']),
        //   error: () => {
        //     console.log(
        //       'you are logged in! but your profile as engineer/recruiter doesnt exist yet'
        //     );
        //     this.router.navigate(['role']);
        //   },
        // });
      },
      error: (err) => {
        new Error(err);
      },
    });

    this.engineersSub = this.engineerService.getAllEngineers().subscribe({
      next: (res) => {
        this.loading = false;
        if (res) {
          res.engineers.forEach((e: any) => {
            if (e.Avatar.includes('https://res.cloudinary.com')) {
              let urlString = e.Avatar.replace('https://res.cloudinary.com/rmsmms/image/upload/', '').replace('.jpg', '').slice(12)
              // changing the image quality setting from cloudinary
              this.imgObj = new CloudinaryImage(urlString, {
                cloudName: 'rmsmms',
              }).format('auto').delivery(quality('auto:best'));;
              // get the string for the img tag
              e.Avatar = this.imgObj.toURL();
              this.tempEngineers.push(e)
            } else {
              this.tempEngineers.push(e)
            }
          })
          this.engineers = this.tempEngineers;
          this.loader.stop();
        } else {
          this.loader.stop();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });


  }

  ngOnDestroy(): void {
    this.engineersSub.unsubscribe();
  }
}
