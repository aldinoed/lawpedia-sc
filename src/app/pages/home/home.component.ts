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
      name: 'LawLibrary',
      image: '/assets/article-logo.png',
      href: '/articles',
    },
    {
      name: 'LawFact',
      image: '/assets/hoax-logo.png',
      href: '/hoax-threads',
    },
    {
      name: 'LawSpeak',
      image: '/assets/speak-up-logo.png',
      href: '/speakup-threads',
    },
    {
      name: 'LawBot',
      image: '/assets/chat-bot-logo.png',
      href: '/chatbot-intro',
    },
  ];

  constructor() {
    this.items$ = collectionData(collection(this.firestore, 'test'));
    this.items$.subscribe((data) => {
      console.log(data);
    });
  }
}
