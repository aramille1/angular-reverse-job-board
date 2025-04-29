import { Component, OnInit } from '@angular/core';
import { CookieConsentService } from '../../services/cookie-consent/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit {
  showBanner = false;

  constructor(private cookieConsentService: CookieConsentService) { }

  ngOnInit(): void {
    // Subscribe to consent status changes
    this.cookieConsentService.consentStatus$.subscribe(status => {
      // Show the banner if no choice has been made
      this.showBanner = status === null;
    });
  }

  acceptAllCookies(): void {
    this.cookieConsentService.setConsentStatus('accepted_all');
    this.showBanner = false;
    this.initializeAnalytics();
  }

  rejectCookies(): void {
    this.cookieConsentService.setConsentStatus('essential_only');
    this.showBanner = false;
  }

  private initializeAnalytics(): void {
    // Here you would initialize analytics services if they're allowed
    // For example, if using Google Analytics
    console.log('Analytics initialized');
  }
}
