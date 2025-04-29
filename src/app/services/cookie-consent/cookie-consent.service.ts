import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private readonly cookieConsentKey = 'cookie_consent_status';
  private readonly analyticsKey = 'allow_analytics';

  private consentStatusSubject = new BehaviorSubject<string | null>(this.getConsentStatus());
  public consentStatus$: Observable<string | null> = this.consentStatusSubject.asObservable();

  constructor() { }

  /**
   * Get the current consent status from localStorage
   */
  getConsentStatus(): string | null {
    return localStorage.getItem(this.cookieConsentKey);
  }

  /**
   * Set the consent status and update the observable
   */
  setConsentStatus(status: 'accepted_all' | 'essential_only'): void {
    localStorage.setItem(this.cookieConsentKey, status);
    localStorage.setItem(this.analyticsKey, status === 'accepted_all' ? 'true' : 'false');
    this.consentStatusSubject.next(status);
  }

  /**
   * Check if analytics and non-essential cookies are allowed
   */
  isAnalyticsAllowed(): boolean {
    return localStorage.getItem(this.analyticsKey) === 'true';
  }

  /**
   * Clear the consent choice and show the banner again
   */
  resetConsentChoice(): void {
    localStorage.removeItem(this.cookieConsentKey);
    localStorage.removeItem(this.analyticsKey);
    this.consentStatusSubject.next(null);
  }
}
