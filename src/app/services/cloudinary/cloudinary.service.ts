import { AuthService } from 'src/app/services/auth.service';
import { Injectable, NgZone, Output } from '@angular/core';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { HttpClient } from '@angular/common/http';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  uploadImg(vals: any): Observable<any>{
    let data = vals;

    return this.http.post("https://api.cloudinary.com/v1_1/rmsmms/upload",data)
  }

  @Output()
  public onUploadedPhotoGetLink: Subject<string> = new Subject<string>();

  public responses: Array<any>;

  public hasBaseDropZoneOver: boolean = false;
  public uploader: FileUploader;
  public title: string;

  constructor(
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.responses = [];

    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest',
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list

      // Add file to upload
      form.append('file', fileItem);
      console.log("fileItem before", fileItem)
      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      console.log("fileItem after withCredentials", fileItem)

      return { fileItem, form };
    };

    // Insert or update an entry in the responses array
    const upsertResponse = (fileItem: { file: any; status?: number; data: any; progress?: any; }) => {
      this.zone.run(() => {
        const existingId = this.responses.reduce((prev, current, index) => {
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
        if (existingId > -1) {
          this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
          if(fileItem.data.url){
            this.onUploadedPhotoGetLink.next(fileItem.data.url);
          }
        } else {
          this.responses.push(fileItem);
        }
      });
    };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file,
          status,
          data: JSON.parse(response)
        }
      );

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) =>
      upsertResponse(
        {
          file: fileItem.file,
          progress,
          data: {}
        }
      );
  }

  updateTitle(value: string) {
    this.title = value;
  }

  fileOverBase(e: any): void {
    console.log(e)
    this.hasBaseDropZoneOver = e;
  }

  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    return Object.keys(fileProperties)
      .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
  }
}
