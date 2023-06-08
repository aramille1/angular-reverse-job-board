import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { CloudinaryService } from 'src/app/services/cloudinary/cloudinary.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
// import {
//   LocationService,
//   Maps,
// } from 'src/app/services/location-service/location.service';
import { errorMessageGenerator } from 'src/app/shared/helpers';
import { regexValidator } from 'src/app/url-regex.validator';
const place = null as unknown as google.maps.places.PlaceResult;
type Components = typeof place.address_components;
const trimValidator: any = (control: FormControl) => {
  if (control.value.startsWith(' ')) {
    return {
      trimError: { value: 'control has leading whitespace' },
    };
  }
  if (control.value.endsWith(' ')) {
    return {
      trimError: { value: 'control has trailing whitespace' },
    };
  }

  return null;
};

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent {
  @ViewChild('search')
  public searchElementRef!: ElementRef;

  @ViewChild('map')
  public mapElementRef!: ElementRef;

  @ViewChild('location') public locationElement!: ElementRef;
  public place: any;

  profileForm!: FormGroup;
  submitted: boolean = false;
  errors: Array<any> = [];
  imgFile: any;
  coverImgFile: string;
  imageSrc: string = '';
  coverImg: string = '';
  loader = this.loadingBar.useRef();

  roleTypes = [
    { name: 'Part-time contract', value: 'contract_part_time' },
    { name: 'Full-time contract', value: 'contract_full_time' },
    { name: 'Part-time employment', value: 'employee_part_time' },
    { name: 'Full-time employment', value: 'employee_full_time' },
  ];

  roleLevels = [
    { name: 'Junior', value: 'junior' },
    { name: 'Middle', value: 'mid_level' },
    { name: 'Senior', value: 'senior' },
    { name: 'Principal', value: 'principal_staff' },
    { name: 'C-Level', value: 'c_level' },
  ];

  public locationFields = [
    'name',
    'cityName',
    'stateCode',
    'countryName',
    'countryCode',
  ];

  constructor(
    private router: Router,
    // private locationService: LocationService,
    private engineerService: EngineerService,
    private ngZone: NgZone,
    private fb: FormBuilder,
    private cloudinary: CloudinaryService,
    private loadingBar: LoadingBarService,
    private commonService: CommonService
  ) {
    // locationService.api.then((maps) => {
    //   this.initAutocomplete(maps);
    // });
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, trimValidator]],
      lastName: ['', [Validators.required, trimValidator]],
      tagLine: ['', [Validators.required, trimValidator]],
      city: ['', [Validators.required, trimValidator]],
      state: [''],
      country: ['', [Validators.required, trimValidator]],
      // location: ['', Validators.required],
      avatar: ['', Validators.required],
      bio: ['', [Validators.required, trimValidator]],
      searchStatus: ['', Validators.required],
      roleType: this.fb.array([], Validators.required),
      roleLevel: this.fb.array([], Validators.required),
      website: [
        '',
        [
          regexValidator(new RegExp('^((?!https://).)*$'), {
            http: 'true',
          }),
          regexValidator(
            new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'),
            { url: 'true' }
          ),
        ],
      ],
      github: [
        '',
        [
          Validators.required,
          regexValidator(new RegExp('^((?!https://).)*$'), {
            http: 'true',
          }),
          regexValidator(new RegExp('^[a-zA-Z0-9-]+/?$'), {
            username: 'true',
          }),
        ],
      ],
      twitter: [
        '',
        [
          regexValidator(new RegExp('^((?!https://).)*$'), {
            http: 'true',
          }),
          regexValidator(new RegExp('^[a-zA-Z0-9_-]+/?$'), {
            username: 'true',
          }),
        ],
      ],
      linkedIn: [
        '',
        [
          regexValidator(new RegExp('^((?!https://).)*$'), {
            http: 'true',
          }),
          regexValidator(new RegExp('^[a-zA-Z0-9-]+/?$'), {
            username: 'true',
          }),
          Validators.required,
        ],
      ],
      stackoverflow: [
        '',
        [
          regexValidator(new RegExp('^((?!https://).)*$'), {
            http: 'true',
          }),
          regexValidator(new RegExp('^[a-z0-9-/]+$'), {
            username: 'true',
          }),
        ],
      ],
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

  submit() {
    this.loader.start();
    this.submitImgToCloudinary();
  }

  // submitting img to Cloudinary and then to backend
  submitImgToCloudinary() {
    this.submitted = true;
    this.errors = [];
    const formData = new FormData();
    formData.append('file', this.imgFile);
    formData.append('upload_preset', 'yakyhtcu');

    this.cloudinary.uploadImg(formData).subscribe({
      next: (res) => {
        this.profileForm.patchValue({ avatar: res.secure_url });
        const data = {
          firstName: this.profileForm.value.firstName,
          lastName: this.profileForm.value.lastName,
          tagLine: this.profileForm.value.tagLine,
          city: this.profileForm.value.city,
          country: this.profileForm.value.country,
          avatar: res.secure_url,
          bio: this.profileForm.value.bio,
          searchStatus: this.profileForm.value.searchStatus,
          roleType: this.profileForm.value.roleType,
          roleLevel: this.profileForm.value.roleLevel,
          linkedIn:
            'https://www.linkedin.com/in/' + this.profileForm.value.linkedIn,
          website: 'https://' + this.profileForm.value.website,
          github: 'https://github.com/' + this.profileForm.value.github,
          twitter: 'https://twitter.com/' + this.profileForm.value.twitter,
          stackoverflow:
            'https://stackoverflow.com/users/' +
            this.profileForm.value.stackoverflow,
        };

        if (this.profileForm.valid) {
          this.engineerService.createEngineer(data).subscribe({
            next: (response: any) => {
              this.submitted = false;
              this.commonService.updateUsersDataForHeader({
                image: data.avatar,
                firstName: data.firstName,
                lastName: data.lastName
              })
              this.router.navigate(['engineers/details', response.engineerId]);
              this.loader.stop();
            },
            error: (error) => {
              this.loader.stop();
              throw error;
            },
          });
        } else {
          this.errors = errorMessageGenerator(this.profileForm.controls);
          this.loader.stop();
        }
      },
      error: (err) => {
        this.errors = errorMessageGenerator(this.profileForm.controls);
        this.loader.stop();
        console.error(err);
      },
    });
  }

  onFileChange(event: any) {
    // getting an image and setting global variable imgFile
    const file = event.target.files[0];
    this.imgFile = file;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    // File Preview
    reader.onload = (event: any) => {
      // setting a preview image without submitting
      this.imageSrc = event.target.result;
    };
  }

//   initAutocomplete(maps: Maps) {
//     setTimeout(() => {
//       let autocomplete = new maps.places.Autocomplete(
//         this.searchElementRef?.nativeElement as HTMLInputElement
//       );
//       autocomplete.addListener('place_changed', () => {
//         this.ngZone.run(() => {
//           this.onPlaceChange(autocomplete.getPlace());
//         });
//       });
//     }, 1000);
//   }
//   // Location selection and setting up city and country
//   onPlaceChange(place: any) {
//     const location = this.locationFromPlace(place);
//     this.profileForm.patchValue({
//       city: location?.cityName,
//       country: location?.countryName,
//     });
//   }
//   public locationFromPlace(place: google.maps.places.PlaceResult) {
//     const components = place.address_components;
//     if (components === undefined) {
//       return null;
//     }

//     const areaLevel3 = getShort(components, 'administrative_area_level_3');
//     const locality = getLong(components, 'locality');

//     const cityName = locality || areaLevel3;
//     const countryName = getLong(components, 'country');
//     const countryCode = getShort(components, 'country');
//     const stateCode = getShort(components, 'administrative_area_level_1');
//     const name = place.name !== cityName ? place.name : null;

//     return {
//       name,
//       cityName,
//       countryName,
//       countryCode,
//       stateCode,
//     };
//   }
// }

// function getComponent(components: Components, name: string) {
//   return components?.filter(
//     (component: { types: string[] }) => component.types[0] === name
//   )[0];
// }

// function getLong(components: Components, name: string) {
//   const component = getComponent(components, name);
//   return component && component.long_name;
// }

// function getShort(components: Components, name: string) {
//   const component = getComponent(components, name);
//   return component && component.short_name;
}
