import { Engineer } from 'src/app/engineer';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EngineerService {

  constructor(private http: HttpClient, private router: Router) { }

  // updateOne(engineer:Engineer): Observable<any> {
  //   return this.http.put('/engineers/' + engineer.id, engineer);
  // }

  findOne(id: any): Observable<any> {
    return this.http.get(`http://localhost:3000/engineers/${id}`).pipe(
      tap((engineer) => console.log(engineer)),
      map((engineer) => engineer)
    )
  }

  updateOne(engineer:any, id:any): Observable<any> {
    return this.http.put(`http://localhost:3000/engineers/${id}`, engineer)
  }
}
