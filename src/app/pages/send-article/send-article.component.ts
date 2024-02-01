import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-send-article',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './send-article.component.html',
  styleUrl: './send-article.component.css'
})
export class SendArticleComponent {
  form: FormGroup;
  firestore: Firestore = inject(Firestore);
  // title: string = '';
  // content: string = '';
  // category: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      title: '',
      content: '',
      category: ''
    });
  }

  onSubmit() {
    if (this.form.valid) {
      addDoc(collection(this.firestore, 'articles'), this.form.value);

    }else {
      console.log('Error');
    }
  }

  // async sendArticle() {
  //   try {
  //     await addDoc(collection(this.firestore, 'articles'), {
  //       title: this.title,
  //       content: this.content,
  //       category: this.category
  //     });
  //   } catch (e) {
  //     console.error('Error adding document: ', e);
  //   }
  // }
}
