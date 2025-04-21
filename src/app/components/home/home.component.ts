import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { quality } from "@cloudinary/url-gen/actions/delivery";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  engineers = new Array<any>();
  tempEngineers = new Array<any>();
  loading: boolean = true;
  loader = this.loadingBar.useRef();
  private engineersSub: Subscription;
  imgObj: CloudinaryImage = new CloudinaryImage(); //needs to be initialized
  imgString: string = ''; //CloudinaryImage;
  constructor(
    private engineerService: EngineerService,
    private loadingBar: LoadingBarService,
  ) {

  }

  ngOnInit(): void {
    this.loader.start();
    this.engineersSub = this.engineerService.getAllEngineers().subscribe({
      next: (res) => {
        this.loading = false;
        if (res) {
          res.engineers.forEach((e: any) => {
            // Check if the engineer profile is new and set the isNew flag
            e.isNew = this.isNewProfile(e);

            if (e.Avatar && e.Avatar.includes('https://res.cloudinary.com')) {
              let urlString = e.Avatar.replace('https://res.cloudinary.com/rmsmms/image/upload/', '').replace('.jpg', '').slice(12)
              // changing the image quality setting from cloudinary
              this.imgObj = new CloudinaryImage(urlString, {
                cloudName: 'rmsmms',
              }).format('auto').delivery(quality('auto:best'));;
              // get the string for the img tag
              e.Avatar = this.imgObj.toURL();
              this.tempEngineers.push(e)
            } else {
              this.tempEngineers.push(e)
            }
          })
          // Log the first few engineers to check isNew flag
          console.log('First few engineers on homepage:', this.tempEngineers.slice(0, 3));

          this.tempEngineers.length = 7
          this.engineers = this.tempEngineers;
          this.loader.stop();
        } else {
          this.loader.stop();
        }
      },
      error: (err) => {
        console.error(err);
      },
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

  ngOnDestroy(): void {
    this.engineersSub.unsubscribe();
  }
}
