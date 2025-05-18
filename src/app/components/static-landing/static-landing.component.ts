import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import { CountriesService } from 'src/app/services/countries/countries.service';
import { forkJoin, Subscription, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-static-landing',
  templateUrl: './static-landing.component.html',
  styleUrls: ['./static-landing.component.scss']
})
export class StaticLandingComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private preloadStartTime: number = 0;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private engineerService: EngineerService,
    private countriesService: CountriesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Set page title
    this.titleService.setTitle('Angular Talents | The Reverse Job Board for Angular Developers');

    // Set meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Angular Talents is the premier reverse job board for Angular developers. Create a profile and let companies discover your skills and experience.'
    });

    // Set additional meta tags for SEO
    this.metaService.updateTag({
      name: 'keywords',
      content: 'Angular jobs, Angular developers, Angular experts, hire Angular developers, Angular careers, Angular employment, job board, reverse job board, TypeScript, Angular framework'
    });

    // Open Graph tags for social sharing
    this.metaService.updateTag({ property: 'og:title', content: 'Angular Talents | The Reverse Job Board for Angular Developers' });
    this.metaService.updateTag({ property: 'og:description', content: 'Angular Talents is the premier reverse job board for Angular developers. Create a profile and let companies discover your skills and experience.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://angulartalents.com' });

    // Twitter Card data
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Angular Talents | The Reverse Job Board for Angular Developers' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Angular Talents is the premier reverse job board for Angular developers. Create a profile and let companies discover your skills and experience.' });

    // Listen for route changes to start preloading when landing page is visible
    this.subscriptions.add(
      this.router.events.pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event)
      ).subscribe((event: NavigationEnd) => {
        if (event.url === '/' || event.url === '') {
          // User is on the landing page, start preloading after a short delay
          // This delay ensures the landing page rendering is prioritized
          setTimeout(() => this.preloadData(), 500);
        }
      })
    );

    // Start preloading data immediately
    this.preloadData();
  }

  /**
   * Preload engineers data to improve navigation performance
   * This data will be cached by the HTTP client so it doesn't need to be
   * fetched again when the user navigates to the engineers page
   */
  preloadData(): void {
    this.preloadStartTime = performance.now();
    console.log('Starting preload of engineers data...');

    // Create a batch of requests to preload
    const preloadRequests = {
      // Preload basic data first
      engineersCount: this.engineerService.getEngineersCount().pipe(
        catchError(err => {
          console.error('Error preloading engineers count:', err);
          return of({ engineers_count: 0 });
        })
      ),

      // Preload first page of engineers with default filters
      engineers: this.engineerService.getEngineers(1, 10, '', '', '').pipe(
        catchError(err => {
          console.error('Error preloading engineers data:', err);
          return of({ engineers: [] });
        })
      ),

      // Preload countries data for filters
      countries: this.countriesService.getCountries().pipe(
        catchError(err => {
          console.error('Error preloading countries data:', err);
          return of([]);
        })
      )
    };

    // Execute all preload requests in parallel
    this.subscriptions.add(
      forkJoin(preloadRequests).pipe(
        finalize(() => {
          const preloadTime = performance.now() - this.preloadStartTime;
          console.log(`Preloading completed in ${preloadTime.toFixed(2)}ms`);
        })
      ).subscribe({
        next: (results) => {
          console.log('Preloaded data successfully:');
          console.log(`- ${results.engineers.engineers?.length || 0} engineers`);
          console.log(`- Total engineers count: ${results.engineersCount.engineers_count}`);
          console.log(`- ${results.countries?.length || 0} countries`);

          // After basic data is loaded, preload additional pages in the background
          this.preloadAdditionalPages();
        }
      })
    );
  }

  /**
   * Preload additional pages of engineer data for faster pagination
   */
  private preloadAdditionalPages(): void {
    // Preload the second page of engineers with default filters
    this.subscriptions.add(
      this.engineerService.getEngineers(2, 10, '', '', '').pipe(
        catchError(err => {
          console.error('Error preloading additional engineers data:', err);
          return of({ engineers: [] });
        })
      ).subscribe({
        next: (results) => {
          console.log(`Preloaded page 2 with ${results.engineers?.length || 0} engineers`);
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
