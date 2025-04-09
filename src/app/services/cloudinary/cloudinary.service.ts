import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Cloudinary } from 'cloudinary-core';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudinary: any;
  public onUploadedPhotoGetLink: Subject<string> = new Subject<string>();
  public responses: Array<any> = [];
  public hasBaseDropZoneOver: boolean = false;
  public title: string;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    private auth: AuthService
  ) {
    this.cloudinary = Cloudinary.new({
      cloud_name: 'rmsmms',
      api_key: '323471786184868',
      api_secret: 'hG7ZYBoalsywIR5RmZ6sIZkWsdU',
      upload_preset: 'yakyhtcu'
    });
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.cloudinary.config().upload_preset);

    return this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`, formData);
  }

  uploadImg(vals: any): Observable<any> {
    return this.http.post(`https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`, vals);
  }

  updateTitle(value: string) {
    this.title = value;
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  getFileProperties(fileProperties: any) {
    if (!fileProperties) {
      return null;
    }
    return Object.keys(fileProperties)
      .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
  }
}
