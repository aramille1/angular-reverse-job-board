import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Article } from '../../models/article.model';
import { Title, Meta } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';

// Define interface for JSON-LD structure
interface BlogPostJsonLd {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    }
  };
  image?: {
    '@type': string;
    url: string;
  };
}

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  article: Article | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private titleService: Title,
    private metaService: Meta,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadArticle(slug);
      } else {
        this.router.navigate(['/blog']);
      }
    });
  }

  loadArticle(slug: string): void {
    this.loading = true;
    this.blogService.getArticleBySlug(slug).subscribe(article => {
      if (article) {
        this.article = article;
        this.setupSEO(article);
        this.generateJsonLd(article);
      } else {
        this.router.navigate(['/blog']);
      }
      this.loading = false;
    });
  }

  setupSEO(article: Article): void {
    // Get a clean version of the content for meta description (remove HTML tags)
    const cleanContent = article.content.replace(/<[^>]*>?/gm, '');
    const metaDescription = cleanContent.substring(0, 160) + '...';

    // Set page title
    this.titleService.setTitle(`${article.title} | Angular Blog`);

    // Update meta description
    this.metaService.updateTag({
      name: 'description',
      content: article.excerpt
    });

    // Set article-specific tags
    this.metaService.updateTag({
      name: 'keywords',
      content: `Angular blog, ${article.title}, Angular development, Angular tips, Angular tutorials, Angular framework`
    });

    // Set article published date
    this.metaService.updateTag({
      name: 'article:published_time',
      content: article.date.toISOString()
    });

    // Set article author
    this.metaService.updateTag({
      name: 'article:author',
      content: article.author
    });

    // Open Graph tags for social sharing
    this.metaService.updateTag({ property: 'og:title', content: article.title });
    this.metaService.updateTag({ property: 'og:description', content: article.excerpt });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });
    this.metaService.updateTag({ property: 'og:url', content: `https://angulartalents.com/blog/${article.slug}` });
    if (article.imageUrl) {
      this.metaService.updateTag({ property: 'og:image', content: article.imageUrl });
    }

    // Twitter Card data
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: article.title });
    this.metaService.updateTag({ name: 'twitter:description', content: article.excerpt });
    if (article.imageUrl) {
      this.metaService.updateTag({ name: 'twitter:image', content: article.imageUrl });
    }
  }

  generateJsonLd(article: Article): void {
    // Remove any existing article JSON-LD (in case of navigation between articles)
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => {
      if (script.textContent && script.textContent.includes('BlogPosting')) {
        script.remove();
      }
    });

    // Create article JSON-LD
    const jsonLd: BlogPostJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': article.title,
      'description': article.excerpt,
      'datePublished': article.date.toISOString(),
      'dateModified': article.date.toISOString(),
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `https://angulartalents.com/blog/${article.slug}`
      },
      'author': {
        '@type': 'Person',
        'name': article.author
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Angular Talents',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://angulartalents.com/assets/logo.png'
        }
      }
    };

    // Add image if available
    if (article.imageUrl) {
      jsonLd.image = {
        '@type': 'ImageObject',
        'url': article.imageUrl
      };
    }

    // Create the script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);

    // Add to document head
    document.head.appendChild(script);
  }
}
