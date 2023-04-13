import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
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
  keyword = 'name';
  data$: Observable<any>;
  data: any = []
  private getMyProfileSub: Subscription
  private getEngineersSub: Subscription
  constructor(
    private engineerService: EngineerService,
    private auth: AuthService,
    private http: HttpClient,
    private loadingBar: LoadingBarService
    ){}

  public config: PaginationInstance = {
      id: 'custom',
      itemsPerPage: 10,
      currentPage: 1
  };
  ngOnInit(): void {
    this.loadingBar.start();
    this.http.get("https://restcountries.com/v3.1/all?fields=name,flags").subscribe({
      next: data => {
        for (const [key, value] of Object.entries(data)){
          this.data.push({id: Number(key+1), name: value.name.common, flag: value.flags.svg})
        }
        console.log(this.data)
      },
      error: err => console.error(err)
    })
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

  startLoading() {

  }

  // getIndex(pageIndex: number){
  // //   this.startIndex = pageIndex * 5;
  // //  this.endIndex = this.startIndex + 5;
  //  this.page = pageIndex+1
  //  this.getEngineers()
  // }
  // prevIndex(){
  //   this.page--
  //   console.log(this.page)
  //   this.getEngineers()
  // }
  // nextIndex(){
  //   this.page++
  //   this.status = !this.status
  //   console.log(this.page)
  //   this.getEngineers()
  // }



  getEngineers(){
    this.getEngineersSub = this.engineerService.getEngineers(this.page, this.limit, this.selectedCountry = '').subscribe(res => {
      console.log(res.engineers)
      this.engineers = res.engineers;
      this.loadingBar.stop();

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

  // onCheck(country:string){
  //   this.selectedCountry = country
  //   console.log(this.selectedCountry)


  // }

  applyFilter(){
    if(this.selectedCountry){
      this.getEngineersSub = this.engineerService.getEngineers(this.page, this.limit, this.selectedCountry).subscribe(res => {
        this.engineers = res.engineers;

        console.log(res.engineers);

    });
    }
  }




    selectEvent(item: any) {
      // do something with selected item
      console.log(item)
      this.getEngineersSub = this.engineerService.getEngineers(this.page, this.limit, item.name).subscribe(res => {

        console.log(res.engineers.length);
        this.total = res.engineers.length

        this.engineers = res.engineers


    });
    }

    // onChangeSearch(val: string) {
    //   console.log(val)
    //   // fetch remote data from here
    //   // And reassign the 'data' which is binded to 'data' property.
    // }

    // onFocused(e:any){
    //   // do something when input is focused
    // }
  }
