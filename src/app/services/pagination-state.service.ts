import { Injectable } from '@angular/core';

interface EngineersFilters {
  country: string;
  countrySearchText: string;
  roleType: string;
  roleLevel: string;
}

interface PaginationState {
  engineersPage: number;
  engineersFilters: EngineersFilters;
}

@Injectable({
  providedIn: 'root',
})
export class PaginationStateService {
  private readonly ENGINEERS_STATE_KEY = 'engineers_pagination_state';

  private paginationState: PaginationState = {
    engineersPage: 1,
    engineersFilters: {
      country: '',
      countrySearchText: '',
      roleType: '',
      roleLevel: ''
    }
  };

  constructor() {
    // Load saved state from sessionStorage on service initialization
    this.loadStateFromStorage();
  }

  // Save current page number and filters
  saveEngineersPageState(page: number, country: string, roleType: string, roleLevel: string, countrySearchText: string = '') {
    this.paginationState.engineersPage = page;
    this.paginationState.engineersFilters = {
      country,
      countrySearchText,
      roleType,
      roleLevel
    };

    // Save to sessionStorage
    this.saveStateToStorage();
  }

  // Get saved page number
  getEngineersPageState() {
    return this.paginationState.engineersPage;
  }

  // Get saved filters
  getEngineersFilters() {
    return this.paginationState.engineersFilters;
  }

  // Save state to sessionStorage
  private saveStateToStorage() {
    try {
      sessionStorage.setItem(
        this.ENGINEERS_STATE_KEY,
        JSON.stringify(this.paginationState)
      );
    } catch (e) {
      console.error('Error saving pagination state to sessionStorage:', e);
    }
  }

  // Load state from sessionStorage
  private loadStateFromStorage() {
    try {
      const savedState = sessionStorage.getItem(this.ENGINEERS_STATE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState) as Partial<PaginationState>;

        // Handle backward compatibility
        if (parsedState.engineersFilters) {
          const filters = parsedState.engineersFilters as Partial<EngineersFilters>;

          // If countrySearchText doesn't exist but country does, set countrySearchText to country value
          if (!('countrySearchText' in filters) && 'country' in filters) {
            filters.countrySearchText = filters.country || '';
          }
        }

        // Merge the parsed state with default state to ensure all properties exist
        this.paginationState = {
          engineersPage: parsedState.engineersPage || 1,
          engineersFilters: {
            ...this.paginationState.engineersFilters,
            ...(parsedState.engineersFilters || {})
          }
        };
      }
    } catch (e) {
      console.error('Error loading pagination state from sessionStorage:', e);
    }
  }
}
