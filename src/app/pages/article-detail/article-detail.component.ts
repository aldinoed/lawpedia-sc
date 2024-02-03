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

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.articleService.getArticle(id ? id : '').subscribe((article) => {
      this.article = article;
      this.publishedDate = article.formatedPublished;
    });
  }
}
