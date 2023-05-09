import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PaginationInstance } from 'ngx-pagination';
import { Observable, Subscription, timeout } from 'rxjs';
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
  total: number = 18;
  pagesCount: Number[] = [1, 2, 3];
  startIndex = 0;
  endIndex = 5;
  recruiterId: number;
  engineerId: number;
  selectedLevelIndex: number;
  selectedTypeIndex: number;
  userIs: string;
  status: boolean = false;
  isMember: boolean = false;
  showBlur: boolean = false;
  showPagination: boolean = true;
  countries: any = [];
  selectedCountry: string = '';
  selectedRoleLevel: string = '';
  selectedRoleType: string = '';
  keyword = 'name';
  data$: Observable<any>;
  data: any = [];
  loader = this.loadingBar.useRef();
  private getMyProfileSub: Subscription;
  private getEngineersSub: Subscription;

  roleLevels = [
    { name: 'Junior', value: 'junior', isSelected: false },
    { name: 'Middle', value: 'mid_level', isSelected: false },
    { name: 'Senior', value: 'senior', isSelected: false },
    { name: 'Principal', value: 'principal_staff', isSelected: false },
    { name: 'C-Level', value: 'c_level', isSelected: false },
  ];

  roleTypes = [
    { name: 'Part-time', value: 'contract_part_time', isSelected: false },
    { name: 'Full-time contract', value: 'contract_full_time', isSelected: false },
    { name: 'Part-time employment', value: 'employee_part_time', isSelected: false },
    { name: 'Full-time employment', value: 'employee_full_time', isSelected: false },
  ];


  constructor(
    private engineerService: EngineerService,
    private auth: AuthService,
    private http: HttpClient,
    private loadingBar: LoadingBarService,
    private fb: FormBuilder
  ) {}

  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  };
  ngOnInit(): void {
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
        console.log(res);
        if (res.type === 'recruiter' && res.user.IsMember) {
          this.recruiterId = res.user.ID;
          this.isMember = true;
          this.userIs = 'recruiter';
        } else {
          this.engineerId = res.user.ID;
          this.userIs = 'engineer';
        }
      },
      error: (err) => {
        console.error(err);
      },
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
    console.log(this.page)
    console.log(this.limit)
    console.log(this.selectedCountry)
    console.log(this.selectedRoleType)
    console.log(this.selectedRoleLevel)
    this.getEngineersSub = this.engineerService
      .getEngineers(
        this.page,
        this.limit,
        this.selectedCountry,
        this.selectedRoleType,
        this.selectedRoleLevel
        )
      .subscribe({
        next: (res) => {
          console.log(res);
          // TODO when user filtering and then resets, pagination disapears even
          if(res.engineers !== null){
            if (res.engineers?.length < 10 && res.engineers) {
              this.showPagination = false;
              this.engineers = res?.engineers;
              this.loader.stop();
            } else {
              this.engineers = res?.engineers;
              this.showPagination = true;
              this.showBlur = true;
              this.loader.stop();
            }
          }else{
            this.engineers = []
          }
        },
        error: (err) => {
          this.loader.stop();
          console.error(err);
        },
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
    this.page = 1;

      this.getEngineersSub = this.engineerService
        .getEngineers(
          this.page,
          this.limit,
          this.selectedCountry,
          this.selectedRoleType,
          this.selectedRoleLevel
          )
        .subscribe({
          next: (res) =>{

            if(res.engineers){
              console.log(res.engineers);
              if(res.engineers.length < 10){
                this.page = 1;
                this.showPagination = false
              }
              this.engineers = res.engineers;
            }else{
              this.engineers = []
            }
          },
          error: (err) =>{
            console.error(err)
          }
        });

  }



  selectEvent(item: any) {
    // do something with selected item
    console.log(item);
    this.selectedCountry = item.name;

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

  handleChangeRoleLevel(e: any, index: any) {
    this.selectedLevelIndex = e.target.checked ? index : undefined;
    if (e.target.checked) {
      this.selectedRoleLevel = e.target.value;
    } else {
      return;
    }
  }

  handleChangeRoleType(e: any, index:any) {
    this.selectedTypeIndex = e.target.checked ? index : undefined;
    if (e.target.checked) {
      this.selectedRoleType = e.target.value;
    }else{
      return
    }
  }

  clearFilter(){
    this.roleLevels.forEach((c) => c.isSelected = false)
    this.roleTypes.forEach((c) => c.isSelected = false)

    this.page = 1;
    this.selectedCountry = '';
    this.selectedRoleLevel = ''
    this.selectedRoleType = ''
    this.getEngineers()
  }
}
