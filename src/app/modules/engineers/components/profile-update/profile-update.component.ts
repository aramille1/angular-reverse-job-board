import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import {
  LocationService,
  Maps,
} from 'src/app/services/location-service/location.service';

const place = null as unknown as google.maps.places.PlaceResult;
type Components = typeof place.address_components;
@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
})
export class ProfileUpdateComponent {
  profileForm!: FormGroup;
  submitted = false;
  constructor(
    private router: Router,
    private locationService: LocationService,
    private auth: AuthService,
    private engineerService: EngineerService,
    private ngZone: NgZone,
    private fb: FormBuilder
  ) {
    locationService.api.then((maps) => {
      this.initAutocomplete(maps);
    });
  }
  @ViewChild('search')
  public searchElementRef!: ElementRef;

  @ViewChild('map')
  public mapElementRef!: ElementRef;

  // @ViewChild('location') public locationElement!: ElementRef;

  roleTypes = [
    { name: 'Part-time', value: 'contract_part_time', checked: false },
    { name: 'Full-time contract', value: 'contract_full_time', checked: false },
    {
      name: 'Part-time emplpoyment',
      value: 'employee_part_time',
      checked: false,
    },
    {
      name: 'Full-time employment',
      value: 'employee_full_time',
      checked: false,
    },
  ];

  roleLevels = [
    { name: 'Junior', value: 'junior', checked: false },
    { name: 'Middle', value: 'mid_level', checked: false },
    { name: 'Senior', value: 'senior', checked: false },
    { name: 'Principal', value: 'principal_staff', checked: false },
    { name: 'C-Level', value: 'c_level', checked: false },
  ];

  public place: any;

  public locationFields = [
    'name',
    'cityName',
    'stateCode',
    'countryName',
    'countryCode',
  ];

  // private map!: google.maps.Map;
  imageSrc: string = '';
  coverImg: string = '';

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      id: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      tagLine: ['', Validators.required],
      city: ['', Validators.required],
      state: new FormControl(''),
      country: ['', Validators.required],
      location: ['', Validators.required],
      // avatar: new FormControl(''),
      // coverImg: new FormControl(''),
      bio: ['', Validators.required],
      searchStatus: ['', Validators.required],
      roleType: this.fb.array([]),
      roleLevel: this.fb.array([]),
      website: [''],
      github: ['', Validators.required],
      twitter: [''],
      linkedIn: ['', Validators.required],
      stackoverflow: [''],
    });
    this.setProfileToUpdate();
  }

  setProfileToUpdate() {
    this.auth.getMyProfile().subscribe((myProfile) => {
      this.profileForm.patchValue({
        id: myProfile.user.ID,
        firstName: myProfile.user.Firstname,
        lastName: myProfile.user.Lastname,
        tagLine: myProfile.user.Tagline,
        city: myProfile.user.City,
        country: myProfile.user.Country,
        location: `${myProfile.user.City} ${myProfile.user.Country}`,
        bio: myProfile.user.Bio,
        searchStatus: myProfile.user.SearchStatus,
        website: myProfile.user.Website,
        github: myProfile.user.Github,
        twitter: myProfile.user.Twitter,
        linkedIn: myProfile.user.LinkedIn,
        stackoverflow: myProfile.user.StackOverflow,
      });
      let roleTypeArr = this.profileForm.controls['roleType'] as FormArray;
      // setting previously saved roletype values to current form
      myProfile.user.RoleType.forEach((roleType: any) => {
        roleTypeArr.push(new FormControl(roleType));
        this.roleTypes.forEach((item) => {
          if (roleType === item.value) {
            item.checked = true;
          }
        });
      });

      let roleLevelArr = this.profileForm.controls['roleLevel'] as FormArray;
      // setting previously saved rolelevel values to current form
      myProfile.user.RoleLevel.forEach((roleLevel: any) => {
        roleLevelArr.push(new FormControl(roleLevel));
        this.roleLevels.forEach((item) => {
          if (roleLevel === item.value) {
            item.checked = true;
          }
        });
      });

      this.profileForm.controls['github'].disable();
      this.profileForm.controls['linkedIn'].disable();
    });
  }

  update() {
    const data = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      tagLine: this.profileForm.value.tagLine,
      city: this.profileForm.value.city,
      country: this.profileForm.value.country,
      bio: this.profileForm.value.bio,
      searchStatus: this.profileForm.value.searchStatus,
      roleType: this.profileForm.value.roleType,
      roleLevel: this.profileForm.value.roleLevel,
      website: this.profileForm.value.website,
      twitter: this.profileForm.value.twitter,
      stackoverflow: this.profileForm.value.stackoverflow,
    };
    this.engineerService.updateProfile(data).subscribe(() => {
      this.router.navigate(['engineers/details', this.profileForm.value.id]);
    });
  }

  handleChangeRoleType(e: any) {
    let roleTypeArr = this.profileForm.get('roleType') as FormArray;
    if (e.target.checked) {
      roleTypeArr.push(new FormControl(e.target.value));
    } else {
      let i = 0;
      roleTypeArr.controls.forEach((type) => {
        if (type.value === e.target.value) {
          roleTypeArr.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  handleChangeRoleLevel(e: any) {
    let roleLevelArr = this.profileForm.get('roleLevel') as FormArray;
    if (e.target.checked) {
      roleLevelArr.push(new FormControl(e.target.value));
    } else {
      let i = 0;
      roleLevelArr.controls.forEach((level) => {
        if (level.value === e.target.value) {
          roleLevelArr.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onFileChange(event: any) {
    // const file = event.target.files[0];
    // this.profileForm.patchValue({
    //   avatar: file,
    // });
    // var reader = new FileReader();
    // reader.readAsDataURL(file);
    // // File Preview
    // reader.onload = (event: any) => {
    //   this.imageSrc = event.target.result;
    // };
  }

  onCoverFileChange(event: any) {
    // const file = event.target.files[0];
    // this.profileForm.patchValue({
    //   coverImg: file,
    // });
    // var reader = new FileReader();
    // reader.readAsDataURL(file);
    // // File Preview
    // reader.onload = (event: any) => {
    //   this.coverImg = event.target.result;
    // };
  }

  initAutocomplete(maps: Maps) {
    setTimeout(() => {
      let autocomplete = new maps.places.Autocomplete(
        this.searchElementRef?.nativeElement as HTMLInputElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          this.onPlaceChange(autocomplete.getPlace());
        });
      });
    }, 1000);
  }

  onPlaceChange(place: any) {
    const location = this.locationFromPlace(place);
    console.log(location);
    this.profileForm.patchValue({
      city: location?.cityName,
      country: location?.countryName,
    });
  }
  public locationFromPlace(place: google.maps.places.PlaceResult) {
    const components = place.address_components;
    if (components === undefined) {
      return null;
    }

    const areaLevel3 = getShort(components, 'administrative_area_level_3');
    const locality = getLong(components, 'locality');

    const cityName = locality || areaLevel3;
    const countryName = getLong(components, 'country');
    const countryCode = getShort(components, 'country');
    const stateCode = getShort(components, 'administrative_area_level_1');
    const name = place.name !== cityName ? place.name : null;

    return {
      name,
      cityName,
      countryName,
      countryCode,
      stateCode,
    };
  }
}

function getComponent(components: Components, name: string) {
  return components?.filter(
    (component: { types: string[] }) => component.types[0] === name
  )[0];
}

function getLong(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.long_name;
}

function getShort(components: Components, name: string) {
  const component = getComponent(components, name);
  return component && component.short_name;
}
