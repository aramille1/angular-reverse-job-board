import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private articles: Article[] = [
    {
      id: 1,
      title: '@let in Angular: The Game Changer for Template Efficiency',
      slug: 'let-in-angular',
      excerpt: 'Learn how the @let decorator in Angular 17+ simplifies template logic, improves performance, and makes your code more maintainable with practical examples and best practices.',
      content: `


      <p>Hey there, fellow Angular enthusiasts! Today I want to chat about something that's been a total game-changer in my recent projects – the <code>@let</code> decorator. If you've been tangled in template syntax, trying to make your Angular apps more readable and efficient, this one's for you.</p>

      <p>Since I started using <code>@let</code> about three months ago, I've found myself wondering how I ever lived without it. It's one of those features that feels so natural once you adopt it that going back seems unthinkable. So let's dive into why I'm so excited about this little decorator.</p>



      <h2>Common Template Challenges in Angular Applications</h2>

      <p>Picture this: you're working on a complex UI. You've got this computed value that you need to use in multiple places in your template. Maybe it's a filtered list, or a formatted string, or some boolean flag that determines whether certain UI elements should be shown.</p>

      <p>Before <code>@let</code>, we had a few less-than-ideal options:</p>

      <ul>
        <li><strong>Option 1:</strong> Calculate it in the component class and store it as a property. But this can bloat your component code and might not react to changes correctly.</li>
        <li><strong>Option 2:</strong> Use getters in your component. But these might run multiple times unnecessarily, causing performance issues.</li>
        <li><strong>Option 3:</strong> Use <code>*ngIf</code> with the "as" syntax. But this creates artificial nesting and scoping issues.</li>
        <li><strong>Option 4:</strong> Create a custom pipe. Extra files, extra complexity.</li>
      </ul>

      <p>Here's what that third option might look like:</p>

      <pre>
      &lt;ng-container *ngIf="items | filterBy:searchTerm as filteredItems"&gt;
        &lt;div *ngFor="let item of filteredItems"&gt;{{ item.name }}&lt;/div&gt;
        &lt;div class="counter"&gt;Found {{ filteredItems.length }} matching items&lt;/div&gt;
      &lt;/ng-container&gt;
      </pre>

      <p>I don't know about you, but I always found this approach clunky. Why do I need an <code>*ngIf</code> when I'm not actually conditionally rendering anything? It's syntactic overhead that makes the template harder to understand at a glance.</p>

      <h2>How @let Solves Template Variables in Angular</h2>

      <p>This is where <code>@let</code> comes to the rescue! It's like Angular finally realized we needed a more direct way to declare template variables. Here's how you'd solve the same problem with <code>@let</code>:</p>

      <pre>
      @let filteredItems = items | filterBy:searchTerm;

      &lt;div *ngFor="let item of filteredItems"&gt;{{ item.name }}&lt;/div&gt;
      &lt;div class="counter"&gt;Found {{ filteredItems.length }} matching items&lt;/div&gt;
      </pre>

      <p>Isn't that cleaner? More direct? More readable? That's the beauty of <code>@let</code> – it cuts right to the chase with no unnecessary wrappers or indirection.</p>

      <h2>Technical Benefits of Using the @let Decorator</h2>

      <p>So what makes <code>@let</code> so special? It's not just syntactic sugar – there's real power under the hood:</p>

      <ul>
        <li><strong>Lazy evaluation:</strong> The expression is only evaluated when the variable is actually used. If a particular view doesn't use your variable, no calculation happens.</li>
        <li><strong>Smart caching:</strong> Once calculated, the value is cached until its dependencies change, saving precious CPU cycles.</li>
        <li><strong>Type inference:</strong> Your IDE and the Angular compiler know the type of your variable, giving you code completion and type checking.</li>
        <li><strong>Visibility throughout the template:</strong> Unlike variables created with "as", <code>@let</code> variables are available everywhere in your template.</li>
      </ul>

      <h2>Practical @let Examples in Angular Applications</h2>

      <h3>1. Working with Forms</h3>

      <p>I was recently working on a form where certain fields became required based on other selections. With <code>@let</code>, it became so much cleaner:</p>

      <pre>
      @let isDeliveryRequired = form.get('serviceType')?.value === 'delivery';
      @let addressRequired = isDeliveryRequired && !form.get('useDefaultAddress')?.value;

      &lt;div class="form-group" [class.required]="addressRequired"&gt;
        &lt;label for="street"&gt;Street Address&lt;/label&gt;
        &lt;input id="street" [required]="addressRequired" /&gt;
      &lt;/div&gt;

      &lt;div class="helper-text" *ngIf="addressRequired"&gt;
        Please enter your full delivery address
      &lt;/div&gt;
      </pre>

      <h3>2. Data Transformations</h3>

      <p>When working with data that needs formatting or transformation before display, <code>@let</code> really shines:</p>

      <pre>
      @let fullName = user.firstName + ' ' + user.lastName;
      @let formattedPhone = user.phone ? formatPhoneNumber(user.phone) : 'No phone provided';
      @let memberSince = formatDate(user.joinDate, 'MMM yyyy');

      &lt;div class="user-card"&gt;
        &lt;h2&gt;{{ fullName }}&lt;/h2&gt;
        &lt;div class="details"&gt;
          &lt;span&gt;📱 {{ formattedPhone }}&lt;/span&gt;
          &lt;span&gt;🗓️ Member since {{ memberSince }}&lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      </pre>

      <h3>3. Working with Observables</h3>

      <p>This is perhaps my favorite use case. Combining <code>@let</code> with the async pipe makes working with observables a breeze:</p>

      <pre>
      @let user = userService.currentUser$ | async;
      @let isAdmin = user?.role === 'admin';
      @let hasPendingTasks = user?.tasks?.some(task => task.status === 'pending') ?? false;

      &lt;div *ngIf="user" class="dashboard"&gt;
        &lt;h1&gt;Welcome back, {{ user.name }}!&lt;/h1&gt;

        &lt;admin-panel *ngIf="isAdmin"&gt;&lt;/admin-panel&gt;

        &lt;div class="task-reminder" *ngIf="hasPendingTasks"&gt;
          You have pending tasks that require your attention
        &lt;/div&gt;
      &lt;/div&gt;
      </pre>

      <p>No more RxJS gymnastics in your component class just to combine a few observable values!</p>

      <h2>Best Practices for Using @let in Angular Templates</h2>

      <p>After using <code>@let</code> extensively on my last two projects, I've picked up some best practices I'd like to share:</p>

      <ol>
        <li><strong>Keep the declarations at the top:</strong> I like to group all my <code>@let</code> declarations at the beginning of the template. This creates a nice "variable section" where I can see all the computations at a glance.</li>
        <li><strong>Use them for complex logic:</strong> If you find yourself writing the same complex condition multiple times in a template, that's a perfect candidate for <code>@let</code>.</li>
        <li><strong>Combine with RxJS operators:</strong> When using with observables, take advantage of RxJS operators in your component, then use <code>@let</code> for the final presentation logic.</li>
        <li><strong>Remember template context:</strong> <code>@let</code> variables defined inside an <code>*ngFor</code> are scoped to that loop item's context.</li>
        <li><strong>Use descriptive names:</strong> Since these variables make your template more declarative, give them clear names that explain what they represent, not how they're calculated.</li>
      </ol>

      <h2>Limitations and Alternatives to @let in Angular</h2>

      <p>While <code>@let</code> is incredibly useful, it's not always the right tool for the job:</p>

      <ul>
        <li><strong>Simple properties:</strong> If you're just accessing a direct property like <code>user.name</code>, there's no need for <code>@let</code>.</li>
        <li><strong>Very complex calculations:</strong> If the computation is extremely heavy, you might want to handle it in the component class with proper lifecycle management.</li>
        <li><strong>When you need imperative updates:</strong> <code>@let</code> is declarative. If you need to imperatively update a value, stick with component properties.</li>
      </ul>


      <h2>Conclusion: Transforming Angular Templates with @let</h2>

      <p>The <code>@let</code> decorator has truly changed how I approach template logic in Angular. It's one of those features that, once you start using it, seems so obvious and essential that you wonder how you managed without it.</p>

      <p>I've found that my templates are now more readable, my components are leaner, and my code is more maintainable overall. The declarative nature of <code>@let</code> aligns perfectly with Angular's philosophy, making it a natural fit in the ecosystem.</p>

      <p>Have you tried using <code>@let</code> in your projects? I'd love to hear about your experiences! Drop a comment below, and let's discuss how this little decorator is transforming our Angular templates for the better.</p>

      <p>Until next time, happy coding! <br>Angular Talents Team 🚀</p>

      <div class="article-tags">
        <strong>Keywords:</strong> Angular, @let, template variables, declarative templates, Angular performance, Angular 17, template efficiency, Angular best practices, Angular decorators
      </div>
      `,
      author: 'Angular Talents Team',
      date: new Date('2024-07-20'),
      imageUrl: 'assets/images/angular-let.jpg'
    },
    // {
    //   id: 2,
    //   title: 'Building Scalable Angular Applications',
    //   slug: 'building-scalable-angular-applications',
    //   excerpt: 'Learn the best practices for building large-scale applications that can grow with your business needs.',
    //   content: 'This is a dummy article about building scalable Angular applications.',
    //   author: 'John Developer',
    //   date: new Date('2023-10-20'),
    //   imageUrl: 'assets/images/angular-scalable.jpg'
    // },
    // {
    //   id: 3,
    //   title: 'Angular Performance Optimization Tips',
    //   slug: 'angular-performance-optimization-tips',
    //   excerpt: "Improve your Angular application's performance with these proven optimization techniques.",
    //   content: 'This is a dummy article about Angular performance optimization tips.',
    //   author: 'Sarah Engineer',
    //   date: new Date('2023-09-05'),
    //   imageUrl: 'assets/images/angular-performance.jpg'
    // }
  ];

  constructor() { }

  getArticles(): Observable<Article[]> {
    return of(this.articles);
  }

  getArticleBySlug(slug: string): Observable<Article | undefined> {
    const article = this.articles.find(a => a.slug === slug);
    return of(article);
  }
}
