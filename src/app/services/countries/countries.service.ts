import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

export interface Country {
  id: number;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  // Use shareReplay to cache the countries data after the first request
  private countries$ = this.http.get<Country[]>('assets/data/countries.json').pipe(
    shareReplay(1),
    catchError(error => {
      console.error('Error loading countries data:', error);
      return of([]);
    })
  );

  constructor(private http: HttpClient) {}

  /**
   * Get list of all countries
   */
  getCountries(): Observable<Country[]> {
    return this.countries$;
  }

  /**
   * Find a country by name
   */
  findCountryByName(name: string): Observable<Country | undefined> {
    return this.countries$.pipe(
      map(countries => countries.find(country =>
        country.name.toLowerCase() === name.toLowerCase()
      ))
    );
  }

  /**
   * Find a country by ID
   */
  findCountryById(id: number): Observable<Country | undefined> {
    return this.countries$.pipe(
      map(countries => countries.find(country => country.id === id))
    );
  }
}
