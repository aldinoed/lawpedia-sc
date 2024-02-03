import { Component } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-article',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditorModule],
  templateUrl: './send-article.component.html',
  styleUrl: './send-article.component.css',
})
export class SendArticleComponent {
  form: FormGroup;
  firestore: Firestore = inject(Firestore);

  // ARTICLE CATEGORY LIST
  articleCategories = [
    'Hukum Internasional',
    'Hukum Bisnis',
    'Hukum Administrasi Negara',
  ];

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.form = this.formBuilder.group({
      title: '',
      content: '',
      category: '',
    });
  }

  async onSubmit() {
    try {
      await addDoc(collection(this.firestore, 'articles'), {
        author: 'John Doe',
        title: this.form.value.title,
        content: this.form.value.content,
        category: this.form.value.category,
        views: 0,
        published: new Date(),
        // formatedPublished: new Date().toLocaleDateString(),
      });
      Swal.fire({
        title: 'Berhasil!',
        text: 'Berhasil publish artikel!',
        icon: 'success',
      }).then(() => {
        this.router.navigate(['articles']);
      });
    } catch (e) {
      console.error('Error adding document: ', e);
      Swal.fire({
        title: 'Gagal!',
        text: `Ada masalah: ${e}`,
        icon: 'error',
      });
    }
  }
}
