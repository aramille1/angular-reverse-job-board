import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  engineers = new Array<any>();
  loading: boolean = true;
  loader = this.loadingBar.useRef();
  private engineersSub: Subscription;

  constructor(
    private engineerService: EngineerService,
    private loadingBar: LoadingBarService
  ) { }

  ngOnInit(): void {
    this.loader.start();
    this.engineersSub = this.engineerService.getAllEngineers().subscribe({
      next: (res) => {
        this.loading = false;
        if (res) {
          this.engineers = res.engineers;
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
