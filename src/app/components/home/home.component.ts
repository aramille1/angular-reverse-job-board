import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  engineers = new Array<any>();
  private engineersSub: Subscription

  constructor(private engineerService: EngineerService){}

  ngOnInit(): void {
    this.engineersSub = this.engineerService.getAllEngineers().subscribe({
      next: (res) =>{
        console.log(res.engineers)
        this.engineers = res.engineers
      },
      error: (err) => console.error(err)
    })
  }

  ngOnDestroy(): void {
    this.engineersSub.unsubscribe();
  }
}
