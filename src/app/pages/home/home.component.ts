import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  items$: Observable<any[]>;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.items$ = collectionData(collection(this.firestore, 'test'));
    this.items$.subscribe((data) => {
      console.log(data);
    });
  }
}
