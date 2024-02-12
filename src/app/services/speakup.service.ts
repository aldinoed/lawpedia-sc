import { Injectable } from '@angular/core';
import { Firestore, 
  addDoc, 
  collection, 
  collectionData, 
  doc, 
  setDoc 
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

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
    return collectionData(collection(this.firestore, 'speakupThreads', threadId, 'comments'), { idField: 'id' });
  }

  getSpeakupReply(threadId: string, commentId: string) {
    return collectionData(collection(this.firestore, 'speakupThreads', threadId, 'comments', commentId, 'replies'), { idField: 'id' });
  }

  addSpeakupThread(data: any) {
    return addDoc(collection(this.firestore, 'speakupThreads'), data);
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

  getThreadCategory(categoryId: string) {
    return collectionData(collection(this.firestore, 'articleCategory', categoryId, 'followers'), { idField: 'id' });
  }
  
}
