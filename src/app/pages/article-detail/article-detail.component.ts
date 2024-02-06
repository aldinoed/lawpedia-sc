import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../services/article.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css',
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  publishedDate: Date = new Date();
  articleCategory = '';
  rating: number = 0;

  // RATING COMPONENT
  getInitialName(name: string): string {
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i].charAt(0);
    }

    return initials;
  }

  authenticatedUser: string = 'John Doe';  // Authenticated User Data
  userNameLength: number = this.authenticatedUser.length;
  profileBackgroundData: Array<string> = [
    'bg-gray-800',
    'bg-gray-500',
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-rose-500',
    'bg-emerald-500',
  ];

  getRandomBackground(): string {
    const length = this.profileBackgroundData.length;
    const randomIndex = Math.floor(Math.random() * length);
    return this.profileBackgroundData[randomIndex];
  }

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
