import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { PaginationStateService } from 'src/app/services/pagination-state.service';

@Component({
  selector: 'app-engineers',
  templateUrl: './engineers.component.html',
  styleUrls: ['./engineers.component.scss'],
})
export class EngineersComponent implements OnInit, OnDestroy {
  // variables
  engineers = new Array<any>();
  tempEngineers = new Array<any>();
  limit: number = 10;
  page: number = 1;
  total: number = 22;
  recruiterId: number;
  engineerId: number;
  selectedLevelIndex: number | undefined;
  selectedTypeIndex: number | undefined;
  userIs: string;
  isMember: boolean = false;
  showBlur: boolean = false;
  showNotFound: boolean = false;
  showPagination: boolean = false;
  loading: boolean = true;
  selectedCountry: string = '';
  selectedRoleLevel: string = '';
  selectedRoleType: string = '';
  imgObj: CloudinaryImage = new CloudinaryImage();
  imgString: string = '';
  keyword = 'name';
  countriesData: any = [];
  loader = this.loadingBar.useRef();
  private subscriptions = new Subscription();
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1,
  };

  roleLevels = [
    { name: 'Junior', value: 'junior', isSelected: false },
    { name: 'Middle', value: 'mid_level', isSelected: false },
    { name: 'Senior', value: 'senior', isSelected: false },
    { name: 'Principal', value: 'principal_staff', isSelected: false },
    { name: 'C-Level', value: 'c_level', isSelected: false },
  ];

  roleTypes = [
    {
      name: 'Part-time contract',
      value: 'contract_part_time',
      isSelected: false,
    },
    {
      name: 'Full-time contract',
      value: 'contract_full_time',
      isSelected: false,
    },
    {
      name: 'Part-time employment',
      value: 'employee_part_time',
      isSelected: false,
    },
    {
      name: 'Full-time employment',
      value: 'employee_full_time',
      isSelected: false,
    },
  ];

  constructor(
    private engineerService: EngineerService,
    private loadingBar: LoadingBarService,
    private auth: AuthService,
    private http: HttpClient,
    private paginationStateService: PaginationStateService
  ) { }

  ngOnInit(): void {
    this.loader.start();

    // Restore pagination state
    this.page = this.paginationStateService.getEngineersPageState();
    const savedFilters = this.paginationStateService.getEngineersFilters();
    if (savedFilters) {
      this.selectedCountry = savedFilters.country;
      this.selectedRoleType = savedFilters.roleType;
      this.selectedRoleLevel = savedFilters.roleLevel;

      // Update filter UI to match saved state
      this.updateFilterUI();
    }

    // Fetch all initial data with a single subscription using forkJoin
    const countriesSub = this.http.get('https://restcountries.com/v3.1/all?fields=name,flags')
      .pipe(catchError(error => {
        console.error('Error loading countries:', error);
        return of([]);
      }));

    const profileSub = this.auth.getMyProfile()
      .pipe(catchError(error => {
        console.error('Error loading profile:', error);
        return of({type: '', user: {}});
      }));

    const engineersCountSub = this.engineerService.getEngineersCount()
      .pipe(catchError(error => {
        console.error('Error loading count:', error);
        return of({engineers_count: 0});
      }));

    // Using forkJoin to combine all initial data requests
    this.subscriptions.add(
      forkJoin({
        countries: countriesSub,
        profile: profileSub,
        count: engineersCountSub
      }).pipe(
        // After getting initial data, fetch engineers
        tap(results => {
          // Process countries
          if (results.countries) {
            for (const [key, value] of Object.entries(results.countries)) {
              this.countriesData.push({
                id: Number(key) + 1,
                name: value.name.common,
                flag: value.flags.svg,
              });
            }
          }

          // Process profile
          const res = results.profile;
          switch (true) {
            case res.type === 'recruiter' && res.user.IsMember:
              this.recruiterId = res.user.ID;
              this.isMember = true;
              this.showBlur = true;
              this.userIs = 'recruiter';
              break;
            case res.type === 'recruiter':
              this.recruiterId = res.user.ID;
              this.userIs = 'recruiter';
              break;
            case !!res.user?.ID:
              this.engineerId = res.user.ID;
              this.userIs = 'engineer';
              break;
          }

          // Process count
          if (results.count) {
            this.total = results.count.engineers_count;
          }
        }),
        // After processing initial data, get engineers
        finalize(() => this.getEngineers())
      ).subscribe()
    );
  }

  private updateFilterUI(): void {
    if (this.selectedRoleLevel) {
      const levelIndex = this.roleLevels.findIndex(level => level.value === this.selectedRoleLevel);
      if (levelIndex !== -1) {
        this.roleLevels[levelIndex].isSelected = true;
        this.selectedLevelIndex = levelIndex;
      }
    }

    if (this.selectedRoleType) {
      const typeIndex = this.roleTypes.findIndex(type => type.value === this.selectedRoleType);
      if (typeIndex !== -1) {
        this.roleTypes[typeIndex].isSelected = true;
        this.selectedTypeIndex = typeIndex;
      }
    }
  }

  getEngineers() {
    // Cancel previous subscription if it exists
    if (this.subscriptions) {
      this.subscriptions.add(
        this.engineerService
          .getEngineers(
            this.page,
            this.limit,
            this.selectedCountry,
            this.selectedRoleType,
            this.selectedRoleLevel
          )
          .pipe(
            finalize(() => this.loader.stop())
          )
          .subscribe({
            next: (res) => {
              if (res.engineers !== null) {
                this.tempEngineers = [];
                this.loading = false;
                this.showPagination = (res.engineers?.length < 10 && res.engineers && this.page === 1) ? false : true;

                res.engineers.forEach((e: any) => {
                  if (e.Avatar && e.Avatar.includes('https://res.cloudinary.com')) {
                    let urlString = e.Avatar.replace('https://res.cloudinary.com/rmsmms/image/upload/', '').replace('.jpg', '').slice(12)
                    // changing the image quality setting from cloudinary
                    this.imgObj = new CloudinaryImage(urlString, {
                      cloudName: 'rmsmms',
                    }).format('auto').delivery(quality('auto:best'));

                    // get the string for the img tag
                    e.Avatar = this.imgObj.toURL();
                    this.tempEngineers.push(e)
                  } else {
                    this.tempEngineers.push(e)
                  }
                });

                this.engineers = this.tempEngineers;
              } else {
                this.engineers = [];
              }
            },
            error: (err) => {
              console.error(err);
              this.engineers = [];
            },
          })
      );
    }
  }

  pageChangeEvent(event: number) {
    this.page = event;
    // Save pagination state when page changes
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel
    );
    this.getEngineers();
  }

  applyFilter() {
    this.page = 1;
    this.showNotFound = false;
    // Save filter state
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel
    );

    // Use the existing getEngineers method instead of creating a new subscription
    this.getEngineers();
  }

  selectCountry(item: any) {
    this.selectedCountry = item?.name;

    // Save state when country changes
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel
    );
  }

  onCountryCleared(event: void) {
    event === undefined ? (this.selectedCountry = '') : null;

    // Save state when country is cleared
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel
    );
  }

  handleChangeRoleLevel(e: any, index: any) {
    this.selectedLevelIndex = e.target.checked ? index : undefined;
    if (e.target.checked) {
      this.selectedRoleLevel = e.target.value;
    } else {
      this.selectedRoleLevel = '';
    }

    // Save state when filter changes
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel
    );
  }

  handleChangeRoleType(e: any, index: any) {
    this.selectedTypeIndex = e.target.checked ? index : undefined;
    if (e.target.checked) {
      this.selectedRoleType = e.target.value;
    } else {
      this.selectedRoleType = '';
    }

    // Save state when filter changes
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel
    );
  }

  clearFilter() {
    this.roleLevels.forEach((c) => (c.isSelected = false));
    this.roleTypes.forEach((c) => (c.isSelected = false));
    this.page = 1;
    this.selectedCountry = '';
    this.selectedRoleLevel = '';
    this.selectedRoleType = '';
    this.selectedLevelIndex = undefined;
    this.selectedTypeIndex = undefined;

    // Save the cleared state
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel
    );

    this.getEngineers();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
