import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../services/article.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css',
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  publishedDate: Date = new Date();
  articleCategory = '';
  rating: number = 0;

  popularArticles: Array<any> = [
    {
      id: 'id1',
      title: 'Judul Artikel Populer 1',
      author: 'John Doe',
      views: 100,
      published: new Date(),
    },
    {
      id: 'id1',
      title: 'Judul Artikel Populer 1',
      author: 'John Doe',
      views: 100,
      published: new Date(),
    },
    {
      id: 'id1',
      title: 'Judul Artikel Populer 1 adbajbdka akdbkabd kadkabdka kabdkabdka kabdkabdka',
      author: 'John Doe',
      views: 100,
      published: new Date(),
    },
    {
      id: 'id1',
      title: 'Judul Artikel Populer 1',
      author: 'John Doe',
      views: 100,
      published: new Date(),
    },
  ];

  // RATING COMPONENT
  getInitialName(name: string): string {
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i].charAt(0);
    }

    return initials;
  }

  authenticatedUser: string = 'John Doe'; // Authenticated User Data
  userNameLength: number = this.authenticatedUser.length;

  ratingValue = 0; // Rating Data

  selectRating(value: number) {
    this.ratingValue = value;
  }

  onRatingSubmit() {
    this.articleService.rateArticle(this.article?.id, this.ratingValue);
  }

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.articleService.getArticle(id ? id : '').subscribe((article) => {
      this.article = article;
      this.publishedDate = article.published.toDate();
      this.articleCategory = article.category;
    });
    this.articleService.getArticleRating(id ? id : '').subscribe((rating) => {
      this.rating = rating;
    });
  }
}
