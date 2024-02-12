import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Database, get } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  topics: Observable<Topic[]>;

  constructor(
    private firestore: Firestore,
    private auth: AuthService,
    private database: Database,
    private http: HttpClient
  ) {
    this.topics = collectionData(collection(this.firestore, 'chatbotTopics'), {
      idField: 'id',
    }) as Observable<Topic[]>;
  }

  getChatbotHistory(): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        if (user) {
          const uid = user.uid;
          const chatbotHistoryRef = collection(
            this.firestore,
            'chatbotHistory'
          );
          const q = query(chatbotHistoryRef, where('userId', '==', uid));
          return collectionData(q, { idField: 'id' });
        } else {
          return of([]);
        }
      })
    );
  }

  getChatbotRooms(historyId: string): Observable<any> {
    const chatbotRoomsRef = collection(
      this.firestore,
      'chatbotHistory',
      historyId,
      'rooms'
    );
    return collectionData(chatbotRoomsRef, { idField: 'id' });
  }

  getChatbotMessage(historyId: string, roomId: string): Observable<any> {
    const chatbotRoomRef = collection(
      this.firestore,
      'chatbotHistory',
      historyId,
      'rooms',
      roomId,
      'messages'
    );
    return collectionData(chatbotRoomRef, { idField: 'id' });
  }

  getTopics(): Observable<Topic[]> {
    return this.topics;
  }

  sendQuestion(
    formData: any,
    historyId: string,
    roomId: string,
    question: string
  ): any {
    const apiUrl = 'http://localhost:1000';
    const chatbotRoomRef = collection(
      this.firestore,
      'chatbotHistory',
      historyId,
      'rooms',
      roomId,
      'messages'
    );
    const message = {
      content: question,
      created: new Date(),
      response: '...',
    };
    console.log('message:', message);

    const addMessagePromise = addDoc(chatbotRoomRef, message);
    const responsePromise = this.http
      .get<any>(`${apiUrl}/chatbot`, { params: formData })
      .toPromise();
    return Promise.all([addMessagePromise, responsePromise])
      .then(([docRef, response]) => {
        const updatedMessage = {
          response: response['answer'] || 'No response',
        };
        console.log('updated message:', updatedMessage);
        const messageDocRef = doc(chatbotRoomRef, docRef.id);
        return updateDoc(messageDocRef, updatedMessage)
          .then(() => {
            console.log('Response updated');
            return docRef.id;
          })
          .catch((error) => {
            console.error('Error updating response:', error);
            // Handle error
            throw error;
          });
      })
      .catch((error) => {
        console.error('Error sending question:', error);
        // Handle error
        throw error;
      });
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
