import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  getDoc,
  setDoc,
  where,
  query,
  DocumentReference,
  deleteDoc,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { get } from '@angular/fire/database';
import { Observable, Subscription, map, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeakupService {
  private firestore: Firestore = inject(Firestore);
  private auth: AuthService = inject(AuthService);

  constructor() { }

  getSpeakupThreads() {
    return collectionData(collection(this.firestore, 'speakupThreads'), { idField: 'id' });
  }

  getSpeakupThread(threadId: string) {
    return getDoc(doc(this.firestore, 'speakupThreads', threadId));
  }

  getSpeakupUpdates(threadId: string) {
    return collectionData(collection(this.firestore, 'speakupThreads', threadId, 'updates'), { idField: 'id' });
  }

  getSpeakupComments(threadId: string) {
    return collectionData(collection(this.firestore, 'speakupThreads', threadId, 'comments'), { idField: 'id' });
  }

  getSpeakupComment(threadId: string, commentId: string) {
    return getDoc(doc(this.firestore, 'speakupThreads', threadId, 'comments', commentId));
  }

  getSpeakupReplies(threadId: string, commentId: string) {
    return collectionData(collection(this.firestore, 'speakupThreads', threadId, 'comments', commentId, 'replies'), { idField: 'id' });
  }

  getSpeakupReply(threadId: string, commentId: string, replyId: string) {
    return getDoc(doc(this.firestore, 'speakupThreads', threadId, 'comments', commentId, 'replies', replyId));
  }

  addSpeakupThread(data: any) {
    return addDoc(collection(this.firestore, 'speakupThreads'), data);
  }

  addSpeakupUpdate(threadId: string, data: any) {
    return addDoc(collection(this.firestore, 'speakupThreads', threadId, 'updates'), data);
  }

  addSpeakupComment(threadId: string, data: any) {
    return addDoc(collection(this.firestore, 'speakupThreads', threadId, 'comments'), data);
  }

  addSpeakupReply(threadId: string, commentId: string, data: any) {
    return addDoc(collection(this.firestore, 'speakupThreads', threadId, 'comments', commentId, 'replies'), data);
  }

  getThreadCategories() {
    return collectionData(collection(this.firestore, 'articleCategory'), { idField: 'id' });
  }

  getThreadCategory(category: DocumentReference) {
    return getDoc(category);
  }

  getCategoryFollowers(categoryId: string) {
    return collectionData(collection(this.firestore, 'articleCategory', categoryId, 'followers'), { idField: 'id' });
  }

  followSubscription: Subscription | undefined;

  followCategory(categoryId: string, userId: string): void {
    const q = query(collection(this.firestore, 'articleCategory', categoryId, 'followers'), where('userId', '==', userId));
    this.followSubscription = collectionData(q, { 'idField': 'id' }).pipe(
      take(1) // Take only the first emission
    ).subscribe((data: any) => {
      if (data.length === 0) {
        addDoc(collection(this.firestore, 'articleCategory', categoryId, 'followers'), { userId })
          .then(() => {
            console.log('Successfully followed');
          })
          .catch(error => console.error('Error following category: ', error));
      } else {
        console.log('Already following', data[0].id);
        deleteDoc(doc(this.firestore, 'articleCategory', categoryId, 'followers', data[0].id))
          .then(() => {
            console.log('Successfully unfollowed');
          })
          .catch(error => console.error('Error unfollowing category: ', error));
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the subscription when the component is destroyed
    if (this.followSubscription) {
      this.followSubscription.unsubscribe();
    }
  }

  getCategoryFollowings(userId: string): Observable<any[]> {
    return collectionData(collection(this.firestore, 'articleCategory'), { idField: 'id' }).pipe(
      map((categories) => {
        const categoryList: any[] = [];
        categories.forEach((category) => {
          const q = query(collection(this.firestore, 'articleCategory', category.id, 'followers'), where('userId', '==', userId));
          collectionData(q).subscribe((data) => {
            if (data.length > 0) {
              categoryList.push(category);
            }
          });
        });
        return categoryList;
      })
    );
  }
}