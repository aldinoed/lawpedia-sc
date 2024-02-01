import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ArticleService {
  private firestore: Firestore = inject(Firestore);
  articles: Observable<Article[]>;
  
  constructor() {
    this.articles = collectionData(collection(this.firestore, 'articles')) as Observable<Article[]>;
  }

  getArticles(): Observable<any[]> {
    return this.articles;
  }

  getPopularArticles(): Observable<any[]> {
    return this.articles.pipe(
      map((articles: any[]) => articles.sort((a, b) => b.views - a.views).slice(0, 10))
    );
  }

  getArticle(id: string): Observable<any> {
    return this.articles.pipe(
      map((articles: any[]) => articles.find(article => article.id === id))
    );
  }
}

export interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
}