import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  items$: Observable<any[]>;
  firestore: Firestore = inject(Firestore);

  // Services Data
  servicesData: Array<any> = [
    {
      name: 'LawLibrary',
      image: '/assets/article-logo.png',
      href: '/lawlibrary',
    },
    {
      name: 'LawFact',
      image: '/assets/hoax-logo.png',
      href: '/lawfact',
    },
    {
      name: 'LawSpeak',
      image: '/assets/speak-up-logo.png',
      href: '/lawspeak',
    },
    {
      name: 'LawBot',
      image: '/assets/chat-bot-logo.png',
      href: '/lawbot',
    },
  ];

  //CONTACT
  subject: string = '';
  body: string = '';

  constructor(private fb: FormBuilder) {
    this.items$ = collectionData(collection(this.firestore, 'test'));
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
