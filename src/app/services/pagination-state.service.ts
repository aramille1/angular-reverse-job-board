import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationStateService {
  private paginationState: {
    engineersPage: number;
    engineersFilters?: {
      country: string;
      roleType: string;
      roleLevel: string;
    };
  } = {
    engineersPage: 1,
    engineersFilters: {
      country: '',
      roleType: '',
      roleLevel: ''
    }
  };

  // Save current page number and filters
  saveEngineersPageState(page: number, country: string, roleType: string, roleLevel: string) {
    this.paginationState.engineersPage = page;
    this.paginationState.engineersFilters = {
      country,
      roleType,
      roleLevel
    };
  }

  // Get saved page number
  getEngineersPageState() {
    return this.paginationState.engineersPage;
  }

  // Get saved filters
  getEngineersFilters() {
    return this.paginationState.engineersFilters;
  }
}
