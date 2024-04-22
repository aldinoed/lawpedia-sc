import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../services/article.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  popularArticles: Array<any> = [];
  quizTaken: boolean = false;

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

  userRating = 0;
  ratingValue = 0;
  selectRating(value: number) {
    this.ratingValue = value;
  }

  onRatingSubmit() {
    if (this.authService.isLoggedIn()) {
      this.articleService.rateArticle(this.article?.id, this.ratingValue);
      Swal.fire({
        title: 'Good Job!',
        text: `You have successfully rated this article.`,
        icon: 'success',
      });
    } else {
      Swal.fire({
        title: 'Rating Failed!',
        text: `You must be logged in to rate this article.`,
        icon: 'error',
      });
    }
  }

  // CONSTUCTOR
  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private router: Router,
    private authService: AuthService
  ) { }

  // INIT
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.articleService.getArticle(id ? id : '').subscribe((article) => {
      this.article = article;
      this.publishedDate = article.published.toDate();
      this.articleCategory = article.category;
      this.articleService.getQuizHistory(article?.id).subscribe((history) => {
        this.quizTaken = history.length > 0;
      });
      this.articleService.getUserRating(article?.id).subscribe((rating) => {
        this.ratingValue = rating;
      });
    });
    this.articleService.getArticleRating(id ? id : '').subscribe((rating: any) => {
      this.rating = rating;
    });
    this.loadPopularArticles();
  }

  // LOAD POPULAR ARTICLES
  private loadPopularArticles() {
    this.articleService.getPopularArticles().subscribe((articles) => {
      articles.sort((a, b) => b.views - a.views);
      this.popularArticles = articles.map((article) => ({
        id: article.id,
        title: article.title,
        author: article.author,
        content: this.articleService.getCleanContent(article.content),
        category: article.category,
        views: article.views,
        published: article.published.toDate(),
      }));
    });
  }

  navigateToArticle(articleId: string) {
    // navigasi ke article detail
    this.router.navigate(['/lawlibrary/detail', articleId]).then(() => {
      // Setelah navigasi, refresh halaman
      window.location.reload();
    });
  }

  takeQuiz() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/lawlibrary/detail', this.article?.id, 'quiz']);
    } else {
      Swal.fire({
        title: 'Quiz Failed!',
        text: `You must be logged in to take the quiz.`,
        icon: 'error',
      });
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        title: 'Link copied!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    });
  }
}
