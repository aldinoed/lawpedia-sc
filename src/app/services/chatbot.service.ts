import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor() { }

  getChatHistory(): Observable<ChatHistory[]> {
    return new Observable<ChatHistory[]>(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  getTopic(): Observable<Topic[]> {
    return new Observable<Topic[]>(observer => {
      observer.next([]);
      observer.complete();
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
  topic: string;
}
