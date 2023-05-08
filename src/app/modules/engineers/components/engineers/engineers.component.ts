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
  styleUrls: ['./engineers.component.scss'],
})
export class EngineersComponent {
  engineers = new Array<any>();
  limit: number = 10;
  page: number = 1;
  total: number = 13;
  pagesCount: Number[] = [1, 2, 3];
  startIndex = 0;
  endIndex = 5;
  recruiterId:number;
  engineerId: number;
  userIs: string;
  status: boolean = false;
  isMember: boolean = false;
  show: boolean = false;
  countries: any = [];
  selectedCountry: string;
  keyword = 'name';
  data$: Observable<any>;
  data: any = [];
  loader = this.loadingBar.useRef();

  private getMyProfileSub: Subscription;
  private getEngineersSub: Subscription;
  constructor(
    private engineerService: EngineerService,
    private auth: AuthService,
    private http: HttpClient,
    private loadingBar: LoadingBarService
  ) {}

  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  };
  ngOnInit(): void {
    console.log(this.userIs)
    this.loader.start();
    this.http
      .get('https://restcountries.com/v3.1/all?fields=name,flags')
      .subscribe({
        next: (data) => {
          for (const [key, value] of Object.entries(data)) {
            this.data.push({
              id: Number(key + 1),
              name: value.name.common,
              flag: value.flags.svg,
            });
          }
          console.log(this.data);
        },
        error: (err) => console.error(err),
      });
    this.getMyProfileSub = this.auth.getMyProfile().subscribe({
      next: (res) => {
        console.log(res)
        if (res.type === 'recruiter' && res.user.IsMember) {
          this.recruiterId = res.user.ID
          this.isMember = true;
          this.userIs = 'recruiter'
        }
        else{
          this.engineerId = res.user.ID
          this.userIs = 'engineer'
        }
      },
      error: (err) =>{
        console.error(err)
      }
    });
    // TODO need to get number of all engineers and set it in total
    this.getEngineers();
  }

  // getPageAmout(length: number){

  //   console.log(this.engineers.length)
  //   return new Array(length/20)
  // }

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

  getEngineers() {
    this.getEngineersSub = this.engineerService
      .getEngineers(this.page, this.limit, (this.selectedCountry = ''))
      .subscribe({
        next: (res) => {
          console.log(res);

          if(res.engineers?.length < 10){
            this.engineers = res.engineers
            this.loader.stop();
          }else {
            this.engineers = res.engineers
            this.show = true;
            this.loader.stop();
          }
        },
        error: (err) =>{
          this.loader.stop();
          console.error(err)
        }
      });
  }

  pageChangeEvent(event: number) {
    this.page = event;
    this.getEngineers();
  }

  ngOnDestroy(): void {
    this.getMyProfileSub.unsubscribe();
    this.getEngineersSub.unsubscribe();
  }

  // onCheck(country:string){
  //   this.selectedCountry = country
  //   console.log(this.selectedCountry)
  // }

  applyFilter() {
    console.log(this.selectedCountry)
    if (this.selectedCountry) {
      this.getEngineersSub = this.engineerService
        .getEngineers(this.page, this.limit, this.selectedCountry)
        .subscribe((res) => {
          this.engineers = res.engineers;

          console.log(res.engineers);
        });
    }
  }

  selectEvent(item: any) {
    // do something with selected item
    console.log(item);
    this.selectedCountry = item.name

    // this.getEngineersSub = this.engineerService
    //   .getEngineers(this.page, this.limit, item.name)
    //   .subscribe((res) => {
    //     // console.log(res.engineers.length);
    //     // this.total = res.engineers.length
    //     console.log(res.engineers);
    //     this.engineers = res.engineers;
    //   });
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
