import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData, getDoc, doc } from '@angular/fire/firestore';
import { OperatorFunction, Observable, of, forkJoin } from 'rxjs';
import { switchMap, map, toArray } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';
import { from, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ArticleService {
  private firestore: Firestore = inject(Firestore);

  articles: Observable<Article[]>;
  categories: Observable<ArticleCategory[]>;
  combinedArticles: Observable<any[]>;

  constructor() {
    this.articles = collectionData(collection(this.firestore, 'articles'), { idField: 'id' }) as Observable<Article[]>;
    this.categories = collectionData(collection(this.firestore, 'articleCategory'), { idField: 'id' }) as Observable<ArticleCategory[]>;
    this.combinedArticles = combineLatest([this.articles, this.categories]).pipe(
      map(([articles, categories]) => {
        return articles.map(article => {
          const category = categories.find(cat => cat.id === article.category.id);
          return {
            ...article,
            category: category ? category.name : null // Replace null with a default value if needed
          };
        });
      })
    );
  }

  getArticles(): Observable<any[]> {
    return this.combinedArticles;
  }

  getPopularArticles(): Observable<any[]> {
    return this.combinedArticles.pipe(
      map((articles: Article[]) => articles.sort((a, b) => b.views - a.views).slice(0, 10))
    );
  }

  getArticle(id: string): Observable<any> {
    return this.combinedArticles.pipe(
      map((articles: Article[]) => articles.find(article => article.id === id))
    );
  }

  getArticleCategories(): Observable<any[]> {
    return this.categories;
  }

  getArticleCategory(id: string): Observable<any> {
    return this.categories.pipe(
      map((categories: ArticleCategory[]) => categories.find(category => category.id === id))
    );
  }
}

export interface Article {
  id: string;
  author: string;
  title: string;
  category: ArticleCategory;
  content: string;
  views: number;
  published: Date;
}

export interface ArticleCategory {
  id: string;
  name: string;
}