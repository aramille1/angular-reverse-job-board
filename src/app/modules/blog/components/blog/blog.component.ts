import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Article } from '../../models/article.model';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Define interfaces for JSON-LD structure
interface BlogPostingJsonLd {
  '@type': string;
  headline: string;
  description: string;
  datePublished: string;
  author: {
    '@type': string;
    name: string;
  };
  url: string;
}

interface BlogJsonLd {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  url: string;
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    }
  };
  blogPosts: BlogPostingJsonLd[];
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: Article[] = [];
  loading = true;
  page = 1;
  limit = 10;
  total = 0;
  jsonLdScript: SafeHtml | null = null;

  constructor(
    private blogService: BlogService,
    private titleService: Title,
    private metaService: Meta,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadArticles();
    this.setupSEO();
  }

  loadArticles(): void {
    this.loading = true;

    // Use the service to get articles
    this.blogService.getArticles().subscribe(articles => {
      this.articles = articles;
      this.total = this.articles.length;
      this.loading = false;
      this.generateJsonLd();
    });
  }

  setupSEO(): void {
    // Set page title
    this.titleService.setTitle('Angular Blog | Latest Angular Development Articles and Tips');

    // Update meta description
    this.metaService.updateTag({
      name: 'description',
      content: 'Read the latest articles, tutorials, and insights about Angular development, best practices, and tips from our Angular experts.'
    });

    // Set additional meta tags for SEO
    this.metaService.updateTag({
      name: 'keywords',
      content: 'Angular blog, Angular articles, Angular development, Angular tips, Angular tutorials, Angular framework, TypeScript'
    });

    // Open Graph tags for social sharing
    this.metaService.updateTag({ property: 'og:title', content: 'Angular Blog | Latest Angular Development Articles and Tips' });
    this.metaService.updateTag({ property: 'og:description', content: 'Read the latest articles, tutorials, and insights about Angular development, best practices, and tips from our Angular experts.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://angulartalents.com/blog' });

    // Twitter Card data
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Angular Blog | Latest Angular Development Articles and Tips' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Read the latest articles, tutorials, and insights about Angular development, best practices, and tips from our Angular experts.' });
  }

  generateJsonLd(): void {
    // Remove any existing blog JSON-LD
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => {
      if (script.textContent && script.textContent.includes('"@type":"Blog"')) {
        script.remove();
      }
    });

    // Create blogPosts array for JSON-LD
    const blogPosts: BlogPostingJsonLd[] = this.articles.map(article => {
      return {
        '@type': 'BlogPosting',
        'headline': article.title,
        'description': article.excerpt,
        'datePublished': article.date.toISOString(),
        'author': {
          '@type': 'Person',
          'name': article.author
        },
        'url': `https://angulartalents.com/blog/${article.slug}`
      };
    });

    // Create the full JSON-LD script
    const jsonLd: BlogJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      'headline': 'Angular Blog',
      'description': 'Latest articles and insights about Angular development, best practices, and tips.',
      'url': 'https://angulartalents.com/blog',
      'publisher': {
        '@type': 'Organization',
        'name': 'Angular Talents',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://angulartalents.com/assets/logo.png'
        }
      },
      'blogPosts': blogPosts
    };

    // Create the script element with JSON-LD content
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);

    // Add the script to the document head
    document.head.appendChild(script);
  }

  pageChangeEvent(event: number): void {
    this.page = event;
    // In a real app, this would trigger a new service call with pagination
    // this.loadArticles();
  }
}
