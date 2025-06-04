import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';
import { BlogPostComponent } from './components/blog-post/blog-post.component';

const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    data: {
      title: 'Angular Blog | Latest Angular Development Articles and Tips',
      description: 'Read the latest articles, tutorials, and insights about Angular development, best practices, and tips from our Angular experts.'
    }
  },
  {
    path: ':slug',
    component: BlogPostComponent,
    data: {
      title: 'Angular Blog Post',
      description: 'Read detailed insights and tutorials about Angular development on our blog.'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
