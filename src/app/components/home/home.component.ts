import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  engineers = new Array<any>();
  private engineersSub: Subscription

  constructor(private engineerService: EngineerService,private loadingBar: LoadingBarService ){}

  ngOnInit(): void {
    this.loadingBar.start();
    this.engineersSub = this.engineerService.getAllEngineers().subscribe({
      next: (res) =>{
        console.log(res.engineers)
        this.engineers = res.engineers
        this.loadingBar.stop();
      },
      error: (err) => console.error(err)
    })
  }

  ngOnDestroy(): void {
    this.engineersSub.unsubscribe();
  }
}
