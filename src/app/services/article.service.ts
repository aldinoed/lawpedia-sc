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
import { switchMap, map, toArray, take } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';
import { from, combineLatest } from 'rxjs';
import { query, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})

export class ArticleService {
  private firestore: Firestore = inject(Firestore);
  private auth: AuthService = inject(AuthService);

  user$: Observable<any>;
  articles: Observable<Article[]>;
  categories: Observable<ArticleCategory[]>;
  combinedArticles: Observable<any[]>;

  constructor() {
    this.user$ = this.auth.user$;

    this.articles = collectionData(collection(this.firestore, 'articles'), {
      idField: 'id',
    }) as Observable<Article[]>;

    this.categories = collectionData(
      collection(this.firestore, 'articleCategory'),
      { idField: 'id' }
    ) as Observable<ArticleCategory[]>;
    
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

  getArticleDrafts(): Observable<any[]> {
    return collectionData(collection(this.firestore, 'articleDrafts'), {
      idField: 'id',
    });
  }

  addArticle(article: any): void {
    addDoc(collection(this.firestore, 'articleDrafts'), article);
  }

  publishArticle(articleId: string): void {
    const articleRef = doc(this.firestore, 'articleDrafts', articleId);
    getDoc(articleRef).then((doc) => {
      if (doc.exists()) {
        // const data = doc.data();
        const data = {
          author : doc.data()['author'],
          category: doc.data()['category'],
          content: doc.data()['content'],
          published: new Date(),
          title: doc.data()['title'],
          views: 0
        }
        addDoc(collection(this.firestore, 'articles'), data)
        .then(() => {
          console.log('Document successfully written!');
          return setDoc(articleRef, { status: 'Disetujui' }, { merge: true });
        })
        .catch((error) => {
          console.error('Error adding document:', error);
        });
      }
    });
  }


  getArticleQuiz(articleId: string): Observable<any> {
    const quizCollectionRef = collection(this.firestore, 'articles', articleId, 'quiz');
    return collectionData(quizCollectionRef, { idField: "id" });
  }

  saveQuizResult(articleId: string, score: number, selectedAnswers: { [key: string]: string }): void {
    this.auth.user$.subscribe((user) => {
      if (user) {
        const uid = user.uid;
        const quizHistoryRef = collection(this.firestore, 'articles', articleId, 'quizHistory'); 
  
        // Tambahkan dokumen untuk menyimpan skor kuis
        addDoc(quizHistoryRef, {
          user: uid,
          score: score,
        }).then((docRef) => {
          const quizHistoryId = docRef.id;
  
          // Tambahkan subkoleksi "detail" di dalam dokumen quiz history
          const quizDetailRef = collection(this.firestore, 'articles', articleId, 'quizHistory', quizHistoryId, 'detail');
  
          // Tambahkan dokumen untuk setiap pertanyaan dan jawaban pengguna
          Object.entries(selectedAnswers).forEach(([questionId, userAnswer]) => {
            addDoc(quizDetailRef, {
              question: doc(this.firestore, 'articles', articleId, 'quiz', questionId),
              userAnswer: userAnswer,
            }).then(() => {
              Swal.fire({
                title: 'Berhasil!',
                text: 'Skor kuis berhasil disimpan!',
                icon: 'success',
              });
            }).catch((error) => {
              console.error('Error adding document:', error);
              Swal.fire({
                title: 'Oops...',
                text: 'Gagal menyimpan skor kuis. Silakan coba lagi!',
                icon: 'error',
              });
            });
          });
        }).catch((error) => {
          console.error('Error adding document:', error);
          Swal.fire({
            title: 'Oops...',
            text: 'Gagal menyimpan skor kuis. Silakan coba lagi!',
            icon: 'error',
          });
        });
      }
    });
  }

  getQuizHistory(articleId: string): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (user) {
          const uid = user.uid;
          const quizHistoryRef = collection(this.firestore, 'articles', articleId, 'quizHistory');
          const q = query(quizHistoryRef, where('user', '==', uid));
          return collectionData(q, { idField: 'id' });
        } else {
          return of([]);
        }
      })
    );
  }

  getQuizHistoryDetail(articleId: string, quizHistoryId: string): Observable<any> {
    const quizHistoryDetailRef = collection(this.firestore, 'articles', articleId, 'quizHistory', quizHistoryId, 'detail');
    return collectionData(quizHistoryDetailRef, { idField: 'id' });
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
    const ratingRef = collection(this.firestore, 'articles', articleId, 'ratings');
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

  getUserRating(articleId: any): Observable<number> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (user) {
          const uid = user.uid;
          const ratingRef = collection(this.firestore, 'articles', articleId, 'ratings');
          const q = query(ratingRef, where('user', '==', uid));
          return collectionData(q, { idField: 'id' }).pipe(
            map((ratings: any[]) => {
              if (ratings.length > 0) {
                return ratings[0].rating;
              } else {
                return 0;
              }
            })
          );
        } else {
          return of(0);
        }
      })
    );
  }


  rateArticle(articleId: any, rating: number): void {
    this.auth.user$.pipe(
      take(1) // Ambil hanya satu nilai dan kemudian selesaikan langganan
    ).subscribe((user) => {
      if (user) {
        const uid = user.uid;
        const ratingRef = collection(this.firestore, 'articles', articleId, 'ratings');
        const q = query(ratingRef, where('user', '==', uid));
        collectionData(q, { idField: 'id' }).subscribe((ratings: any[]) => {
          if (ratings.length > 0) {
            ratings.forEach((ratingDoc) => {
              const ratingDocRef = doc(ratingRef, ratingDoc.id);
              setDoc(ratingDocRef, { rating: rating }, { merge: true });
            });
          } else {
            addDoc(ratingRef, {
              user: uid,
              rating: rating,
            })
          }
        });
      } else {
        console.error('User not authenticated.');
      }
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