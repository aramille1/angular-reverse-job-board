import { Component } from '@angular/core';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
@Component({
  selector: 'app-engineers',
  templateUrl: './engineers.component.html',
  styleUrls: ['./engineers.component.scss']
})
export class EngineersComponent {
  engineers = new Array<any>();

  constructor(private engineerService: EngineerService){}

  ngOnInit(): void {
    this.engineerService.getEngineers().subscribe(res => {
      console.log(res)
      this.engineers = res.engineers;
  });
  }
}
