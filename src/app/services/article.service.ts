import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData, getDoc, doc } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ArticleService {
  private firestore: Firestore = inject(Firestore);
  articles: Observable<Article[]>;

  constructor() {
    this.articles = collectionData(collection(this.firestore, 'articles')) as Observable<Article[]>;
    this.articles.subscribe((articles: any[]) => {
      const observables = articles.map((article) => getDoc(doc(this.firestore, article.category.path)));
      
      forkJoin(observables).subscribe((categorySnapshots: any[]) => {
        categorySnapshots.forEach((categorySnapshot, index) => {
          const categoryData = categorySnapshot.data();
          articles[index].category = categoryData;
        });
    
        console.log('Updated Articles:', articles);
      });
    });
    this.articles.subscribe((articles: any[]) => console.log('Articles:', articles));
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