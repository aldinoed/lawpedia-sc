import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData, getDoc, doc } from '@angular/fire/firestore';
import { OperatorFunction, Observable, of, forkJoin } from 'rxjs';
import { switchMap, map, toArray } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ArticleService {
  private firestore: Firestore = inject(Firestore);

  articles: Observable<Article[]>;

  constructor() {
    this.articles = collectionData(collection(this.firestore, 'articles'), { idField: 'id' }) as Observable<Article[]>;
    
    // .pipe(
    //   switchMap((articles: (DocumentData | (DocumentData & { id: string; }))[]) => {
    //     // Ambil data kategori untuk setiap artikel
    //     const categoryObservables: Observable<Article>[] = articles.map((article) => {
    //       const categoryDoc = doc(this.firestore, (article as any).category.path);
    //       return from(getDoc(categoryDoc)).pipe(
    //         map((categorySnapshot: DocumentSnapshot<DocumentData>) => {
    //           const categoryData = categorySnapshot.data() as DocumentData;
    //           return { ...(article as any), category: categoryData } as Article;
    //         })
    //       );
    //     });

    //     // Gabungkan hasil observables menjadi satu observable
    //     return forkJoin(categoryObservables).pipe(
    //       toArray()
    //     );
    //   })
    // ) as Observable<(DocumentData | (DocumentData & { id: string; }))[]>;
    // this.articles.subscribe((articles) => console.log(articles));
  }

  getArticles(): Observable<any[]> {
    return this.articles;
  }

  getPopularArticles(): Observable<any[]> {
    return this.articles.pipe(
      map((articles: Article[]) => articles.sort((a, b) => b.views - a.views).slice(0, 10))
    );
  }

  getArticle(id: string): Observable<any> {
    return this.articles.pipe(
      map((articles: Article[]) => articles.find(article => article.id === id))
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