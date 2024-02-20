import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, of, switchMap, throwError } from 'rxjs';
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
import {
  Storage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from '@angular/fire/storage';
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
    private http: HttpClient,
    private storage: Storage
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
          const chatbotHistoryRef = collection(this.firestore, 'chatbotHistory');
          const q = query(chatbotHistoryRef, where('userId', '==', uid));
  
          // Check if chatbot history exists for the user
          return collectionData(q, { idField: 'id' }).pipe(
            switchMap((history) => {
              // If chatbot history exists, return it
              if (history.length > 0) {
                return of(history);
              } else {
                // If chatbot history doesn't exist, create a new one
                return from(addDoc(chatbotHistoryRef, { userId: uid })).pipe(
                  switchMap((docRef) => {
                    // Fetch the newly created chatbot history
                    return this.getChatbotHistory();
                  }),
                  catchError((error) => {
                    console.error('Error creating chatbot history:', error);
                    return of([]);
                  })
                );
              }
            }),
            catchError((error) => {
              console.error('Error fetching chatbot history:', error);
              return of([]);
            })
          );
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

  createChatbotRooms(historyId: string, title: string, topicId: string): any {
    const chatbotRoomsRef = collection(this.firestore, 'chatbotHistory', historyId, 'rooms');
    const topicRef = doc(this.firestore, 'chatbotTopics', topicId)
    const roomData = {
      title: title,
      topic: topicRef
    }
    return addDoc(chatbotRoomsRef, roomData)
  }

  initiateModel(historyId: string, roomId: string): any {
    const apiUrl = 'http://localhost:1000';
  
    const chatbotRoomRef = doc(this.firestore, 'chatbotHistory', historyId, 'rooms', roomId);
    return from(getDoc(chatbotRoomRef)).pipe(
      switchMap((roomDoc: any) => {
        const topicRef = roomDoc.data().topic;
        return from(getDoc(topicRef)).pipe(
          map((topicDoc: any) => {
            const formData = {
              topic: topicDoc.data().name
            };
            // return formData;
            return this.http.get<any>(`${apiUrl}/initiate-chat`, { params: formData })
          })
        );
      })
    );
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

  getTopics(): Observable<any[]> {
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
    console.log("message:", message);
  
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
          }).catch(error => {
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

  addNewDocument(file: File, topic: string): any {
    const storageRef = ref(this.storage, `${topic}/${file.name}`);
    return uploadBytes(storageRef, file);
  }

  getDocuments(topic: string): any {
    const storageRef = ref(this.storage, topic);
    return listAll(storageRef);
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
