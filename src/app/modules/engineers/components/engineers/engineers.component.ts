import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CountriesService } from 'src/app/services/countries/countries.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { PaginationStateService } from 'src/app/services/pagination-state.service';

@Component({
  selector: 'app-engineers',
  templateUrl: './engineers.component.html',
  styleUrls: ['./engineers.component.scss'],
})
export class EngineersComponent implements OnInit, OnDestroy, AfterViewInit {
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
  countrySearchText: string = '';
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

  // References to autocomplete inputs
  @ViewChild('countryAutocomplete') countryAutocomplete: any;
  @ViewChild('mobileCountryAutocomplete') mobileCountryAutocomplete: any;

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
    private paginationStateService: PaginationStateService,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.loader.start();

    // Restore pagination state
    this.page = this.paginationStateService.getEngineersPageState();
    const savedFilters = this.paginationStateService.getEngineersFilters();
    if (savedFilters) {
      this.selectedCountry = savedFilters.country;
      this.countrySearchText = savedFilters.countrySearchText || '';
      this.selectedRoleType = savedFilters.roleType;
      this.selectedRoleLevel = savedFilters.roleLevel;

      // Update filter UI to match saved state
      this.updateFilterUI();
    }

    // Fetch all initial data with a single subscription using forkJoin
    const countriesSub = this.countriesService.getCountries()
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
          if (results.countries && results.countries.length > 0) {
            this.countriesData = results.countries;
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
              this.tempEngineers = [];
              this.loading = false;

              if (res.engineers && res.engineers.length > 0) {
                this.showNotFound = false;
                this.showPagination = (res.engineers.length < this.limit && this.page === 1) ? false : true;

                // Log the first engineer to see what fields it has
                console.log('First engineer:', res.engineers[0]);

                res.engineers.forEach((e: any) => {
                  // Set isNew flag for each engineer
                  e.isNew = this.isNewProfile(e);

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
                this.showNotFound = true;
                this.showPagination = false;
              }
            },
            error: (err) => {
              console.error(err);
              this.engineers = [];
              this.showNotFound = true;
              this.showPagination = false;
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
      this.selectedRoleLevel,
      this.countrySearchText
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
      this.selectedRoleLevel,
      this.countrySearchText
    );

    // Use the existing getEngineers method instead of creating a new subscription
    this.getEngineers();
  }

  selectCountry(item: any) {
    this.selectedCountry = item?.name;
    this.countrySearchText = item?.name;

    // Save state when country changes
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel,
      this.countrySearchText
    );
  }

  onCountryCleared(event: void) {
    event === undefined ? (this.selectedCountry = '') : null;
    this.countrySearchText = '';

    // Save state when country is cleared
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel,
      this.countrySearchText
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
      this.selectedRoleLevel,
      this.countrySearchText
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
      this.selectedRoleLevel,
      this.countrySearchText
    );
  }

  clearFilter() {
    this.roleLevels.forEach((c) => (c.isSelected = false));
    this.roleTypes.forEach((c) => (c.isSelected = false));
    this.page = 1;
    this.selectedCountry = '';
    this.countrySearchText = '';
    this.selectedRoleLevel = '';
    this.selectedRoleType = '';
    this.selectedLevelIndex = undefined;
    this.selectedTypeIndex = undefined;

    // Save the cleared state
    this.paginationStateService.saveEngineersPageState(
      this.page,
      this.selectedCountry,
      this.selectedRoleType,
      this.selectedRoleLevel,
      this.countrySearchText
    );

    this.getEngineers();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  /**
   * Check if any filters are currently active
   */
  hasActiveFilters(): boolean {
    return !!(
      this.selectedCountry ||
      this.selectedRoleLevel ||
      this.selectedRoleType
    );
  }

  /**
   * Get the readable name of a role level based on its value
   */
  getRoleLevelName(value: string): string {
    const roleLevel = this.roleLevels.find(level => level.value === value);
    return roleLevel ? roleLevel.name : value;
  }

  /**
   * Get the readable name of a role type based on its value
   */
  getRoleTypeName(value: string): string {
    const roleType = this.roleTypes.find(type => type.value === value);
    return roleType ? roleType.name : value;
  }

  /**
   * Lifecycle hook after the view is initialized
   * Ensures the country autocomplete field reflects the saved value
   */
  ngAfterViewInit(): void {
    // This will run after the view is initialized and components have been rendered
    setTimeout(() => {
      // Restore country search text if needed
      // The input fields should already have the value due to [(ngModel)]
      if (this.countrySearchText) {
        // We don't need to manually set the value since ngModel does it,
        // but we might need to do additional initialization if required by the component
        console.log('Country search text restored:', this.countrySearchText);
      }
    });
  }

  /**
   * Check if the engineer profile is new (less than 1 week old)
   * @param engineer The engineer object to check
   * @returns true if the profile is less than a week old
   */
  isNewProfile(engineer: any): boolean {
    // Try different possible date fields
    const dateField = engineer.CreatedAt || engineer.created_at || engineer.createdAt || engineer.created || engineer.CreateDate || engineer.creation_date;

    // If no date field found, return false
    if (!dateField) {
      // For debugging:
      console.log('No creation date found for engineer:', engineer.ID);
      return false;
    }

    // Parse the date string into a Date object
    const createdDate = new Date(dateField);

    // Check if date is valid
    if (isNaN(createdDate.getTime())) {
      console.log('Invalid date format:', dateField);
      return false;
    }

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const differenceInTime = currentDate.getTime() - createdDate.getTime();

    // Convert the difference to days
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // Return true if the profile is less than 7 days old
    return differenceInDays < 7;
  }
}
