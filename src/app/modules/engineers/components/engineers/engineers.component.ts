import { Component, Input } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
@Component({
  selector: 'app-engineers',
  templateUrl: './engineers.component.html',
  styleUrls: ['./engineers.component.scss']
})
export class EngineersComponent {
  engineers = new Array<any>();
  limit: number = 10;
  page: number = 1;
  total: number = 13;
  pagesCount: Number[] = [1,2,3];
  startIndex = 0;
  endIndex = 5;
  status:boolean = false;
  isMember: boolean = true;
  countries:any = [];
  selectedCountry: string;
  private getMyProfileSub: Subscription
  private getEngineersSub: Subscription
  constructor(private engineerService: EngineerService, private auth: AuthService){}

  public config: PaginationInstance = {
      id: 'custom',
      itemsPerPage: 10,
      currentPage: 1
  };
  ngOnInit(): void {
    this.getMyProfileSub = this.auth.getMyProfile().subscribe({
      next:res => {
        if(res.type === "recruiter" && res.user.IsMember){
          this.isMember = false
        }
      }
    })
    // TODO need to get number of all engineers and set it in total
    this.getEngineers();
  }

  getPageAmout(length: number){

    console.log(this.engineers.length)
    return new Array(length/20)
  }

  getIndex(pageIndex: number){
  //   this.startIndex = pageIndex * 5;
  //  this.endIndex = this.startIndex + 5;
   this.page = pageIndex+1
   this.getEngineers()
  }
  prevIndex(){
    this.page--
    console.log(this.page)
    this.getEngineers()
  }
  nextIndex(){
    this.page++
    this.status = !this.status
    console.log(this.page)
    this.getEngineers()
  }



  getEngineers(){
    this.getEngineersSub = this.engineerService.getEngineers(this.page, this.limit, this.selectedCountry = '').subscribe(res => {

      const countries = [...new Set( res.engineers.map((engineer:any) => engineer.Country)) ]
      console.log(countries);

      this.countries = countries
      console.log(countries)
      this.engineers = res.engineers;
      // this.total = res.engineers.length
      const tempPagesCount = Math.ceil(res.engineers.length/ this.limit)
      // for(let i = 1; i <= tempPagesCount; i++){
      //   this.pagesCount.push(i)
      // }
      console.log(this.pagesCount);

  });
  }




  pageChangeEvent(event: number){
    this.page = event;
    this.getEngineers()
  }

  ngOnDestroy(): void {
    this.getMyProfileSub.unsubscribe()
    this.getEngineersSub.unsubscribe()
  }

  onCheck(country:string){
    this.selectedCountry = country
    console.log(this.selectedCountry)


  }

  applyFilter(){
    if(this.selectedCountry){
      this.getEngineersSub = this.engineerService.getEngineers(this.page, this.limit, this.selectedCountry).subscribe(res => {
        this.engineers = res.engineers;

        console.log(res.engineers);

    });
    }
  }
}
