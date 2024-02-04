import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  items$: Observable<any[]>;
  firestore: Firestore = inject(Firestore);

  // Services Data
  servicesData: Array<any> = [
    {
      name: 'Artikel',
      image: '/assets/article-logo.png',
      href: '/articles',
    },
    {
      name: 'Hoax Threads',
      image: '/assets/hoax-logo.png',
      href: '/home',
    },
    {
      name: 'SpeakUp Threads',
      image: '/assets/speak-up-logo.png',
      href: '/home',
    },
    {
      name: 'Chatbot',
      image: '/assets/chat-bot-logo.png',
      href: '/home',
    },
  ];

  constructor() {
    this.items$ = collectionData(collection(this.firestore, 'test'));
    this.items$.subscribe((data) => {
      console.log(data);
    });
  }
}
