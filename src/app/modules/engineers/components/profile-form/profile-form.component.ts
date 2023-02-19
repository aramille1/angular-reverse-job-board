import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Engineer } from 'src/app/engineer';
import { AuthService, Maps } from 'src/app/services/auth.service';
const place = null as unknown as google.maps.places.PlaceResult;
type Components = typeof place.address_components;
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
    private ngZone: NgZone
  ) {
    auth.api.then((maps) => {
      this.initAutocomplete(maps);
    });
  }
  @ViewChild('search')
  public searchElementRef!: ElementRef;

  @ViewChild('map')
  public mapElementRef!: ElementRef;

  public entries = [];

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

  profileForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    tagLine: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl(''),
    country: new FormControl('', Validators.required),
    // avatar: new FormControl(''),
    // coverImg: new FormControl(''),
    bio: new FormControl('', Validators.required),

    searchStatus: new FormControl('', Validators.required),

    roleType: new FormGroup({
      partTime: new FormControl(false),
      fullTimeContract: new FormControl(false),
      fullTimeEmployment: new FormControl(false),
    }),

    roleLevel: new FormGroup({
      junior: new FormControl(false),
      middle: new FormControl(false),
      senior: new FormControl(false),
      principal: new FormControl(false),
      cLevel: new FormControl(false),
    }),
    website: new FormControl(''),
    github: new FormControl(''),
    twitter: new FormControl(''),
    linkedin: new FormControl(''),
    stackoverflow: new FormControl(''),
  });

  submit() {
    this.auth.createEngineer(this.profileForm)
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
    let autocomplete = new maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.onPlaceChange(autocomplete.getPlace());
      });
    });
  }

  onPlaceChange(place: any) {
    const location = this.locationFromPlace(place);
    console.log(location);
    this.profileForm.patchValue({
      city: location?.cityName,
      country:location?.countryName
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
