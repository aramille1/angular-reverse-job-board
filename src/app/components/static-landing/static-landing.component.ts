import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-static-landing',
  templateUrl: './static-landing.component.html',
  styleUrls: ['./static-landing.component.scss']
})
export class StaticLandingComponent implements OnInit {

  constructor(
    private titleService: Title,
    private metaService: Meta
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
  }
}
