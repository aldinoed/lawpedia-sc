import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private firestore: Firestore = inject(Firestore);
  topics: Observable<Topic[]>;
  chatHistory: Observable<ChatHistory[]>;

  constructor() {
    this.topics = collectionData(collection(this.firestore, 'chatbotTopics'), {
      idField: 'id',
    }) as Observable<Topic[]>;
    this.chatHistory = collectionData(
      collection(this.firestore, 'chatHistory'),
      { idField: 'id' }
    ) as Observable<ChatHistory[]>;
  }

  getChatHistory(): Observable<ChatHistory[]> {
    return new Observable<ChatHistory[]>(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  getTopics(): Observable<Topic[]> {
    return this.topics;
  }
}

export interface ChatHistory {
  id: number;
  chat: string;
  topic: Topic;
}

export interface Topic {
  id: number;
  name: string;
}
