import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../services/article.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})

export class ArticleListComponent implements OnInit {
  articles: Observable<Article[]> = new Observable<Article[]>();
  popularArticles: Observable<Article[]> = new Observable<Article[]>();

  constructor(
    private articleService: ArticleService,
  ) {}

  ngOnInit() {
    this.articles = this.articleService.getArticles();
    this.popularArticles = this.articleService.getPopularArticles(); 
  }
  
}