import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../services/article.service';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css',
})
export class ArticleListComponent implements OnInit {
  articles: Observable<Article[]> = new Observable<Article[]>();
  popularArticles: Observable<Article[]> = new Observable<Article[]>();

  //Pagination Settings
  p: number = 1;
  collection: Array<any> = []; // contain articles 

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.articles = this.articleService.getArticles();
    this.popularArticles = this.articleService.getPopularArticles();

    // convert observable to object and assign it to collection
    this.articleService.getArticles().subscribe((articles) => {
      this.collection = articles.map((article) => ({
        title: article.title,
        content: article.content,
      }));
    });
    // console.log(this.collection);
  }
}
