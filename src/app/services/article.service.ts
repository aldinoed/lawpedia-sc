import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  getDoc,
  doc,
  setDoc,
  addDoc,
} from '@angular/fire/firestore';
import { OperatorFunction, Observable, of, forkJoin } from 'rxjs';
import { switchMap, map, toArray } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';
import { from, combineLatest } from 'rxjs';
import { query, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})

export class ArticleService {
  private firestore: Firestore = inject(Firestore);

  articles: Observable<Article[]>;
  categories: Observable<ArticleCategory[]>;
  combinedArticles: Observable<any[]>;
  quizzes: Observable<ArticleQuiz[]>;

  constructor() {
    this.articles = collectionData(collection(this.firestore, 'articles'), {
      idField: 'id',
    }) as Observable<Article[]>;
    this.categories = collectionData(
      collection(this.firestore, 'articleCategory'),
      { idField: 'id' }
    ) as Observable<ArticleCategory[]>;
    this.quizzes = collectionData(collection(this.firestore, 'articleQuizzes'), {
      idField: 'id',
    }) as Observable<ArticleQuiz[]>;
    this.combinedArticles = combineLatest([
      this.articles,
      this.categories,
    ]).pipe(
      map(([articles, categories]) => {
        return articles.map((article) => {
          const category = categories.find(
            (cat) => cat.id === article.category.id
          );
          return {
            ...article,
            category: category ? category.name : null,
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
      map((articles: Article[]) =>
        articles.sort((a, b) => b.views - a.views).slice(0, 8)
      )
    );
  }

  getArticle(id: string): Observable<any> {
    this.updateArticleViews(id);
    return this.combinedArticles.pipe(
      map((articles: Article[]) =>
        articles.find((article) => article.id === id)
      )
    );
  }
  getArticleQuiz(articleId: string): Observable<any> {
    return this.quizzes.pipe(
      map((quizzes: any[]) =>
        quizzes.find((quiz) => quiz.article.id === articleId)
      ),
      switchMap((quiz: any) => {
        if (quiz) {
          const quizRef = doc(this.firestore, 'articleQuizzes', quiz.id);
          const quizCollectionRef = collection(this.firestore, 'articleQuizzes', quiz.id, 'quiz');
          return collectionData(quizCollectionRef, { idField: "id" }).pipe(
            map((quizData: any[]) => {
              return {
                ...quiz,
                quiz: quizData
              };
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  getArticleCategories(): Observable<any[]> {
    return this.categories;
  }

  getArticleCategory(id: string): Observable<any> {
    return this.categories.pipe(
      map((categories: ArticleCategory[]) =>
        categories.find((category) => category.id === id)
      )
    );
  }

  getArticleRating(articleId: any): Observable<number> {
    const articleRef = doc(this.firestore, 'articles', articleId);
    const ratingRef = query(
      collection(this.firestore, 'articleRatings'),
      where('article', '==', articleRef)
    );

    return collectionData(ratingRef).pipe(
      map((ratings: any[]) => {
        let ratingValue: number = 0;
        ratings.forEach((rating: any) => {
          ratingValue += rating.rating;
        });
        const ratingAverage = ratingValue / ratings.length;
        return ratingAverage;
      })
    );
  }

  rateArticle(articleId: any, rating: number): void {
    const articleRef = doc(this.firestore, 'articles', articleId);
    addDoc(collection(this.firestore, 'articleRatings'), {
      article: articleRef,
      rating: rating,
    })
      .then(() => {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Berhasil memberi rating!',
          icon: 'success',
        });
      })
      .catch((error) => {
        console.error('Error adding document:', error);
        Swal.fire({
          title: 'Oops...',
          text: 'Gagal memberi rating. Silakan coba lagi!',
          icon: 'error',
        });
      });
  }

  updateArticleViews(id: string): void {
    const articleRef = doc(this.firestore, 'articles', id);
    getDoc(articleRef).then((doc) => {
      if (doc.exists()) {
        const article = doc.data() as Article;
        setDoc(articleRef, { views: article.views + 1 }, { merge: true });
      }
    });
  }

  getCleanContent(content: string): string {
    // Bersihkan tag <img> dari konten
    const cleanContent = content.replace(/<img[^>]*>/g, '');
    return cleanContent;
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
  ratings: number;
}

export interface ArticleCategory {
  id: string;
  name: string;
}

export interface ArticleQuiz {
  id: string;
  article: Article;
  quiz: Array<any>;
}