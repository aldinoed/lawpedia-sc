import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
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
import { ArticleService } from '../../services/article.service';
import { ArticleCategory } from '../../services/article.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-send-article',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // EditorModule,
    CKEditorModule,
  ],
  templateUrl: './send-article.component.html',
  styleUrl: './send-article.component.css',
})
export class SendArticleComponent implements OnInit {
  form: FormGroup;
  firestore: Firestore = inject(Firestore);
  categories: Category[] = [];
  public Editor = ClassicEditor;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private articleService: ArticleService
  ) {
    this.form = this.formBuilder.group({
      title: '',
      author: '',
      content: '',
      category: '',
    });
  }

  ngOnInit(): void {
    this.articleService.getArticleCategories().subscribe((categories) => {
      this.categories = categories.map((category) => ({
        value: category.id,
        viewValue: category.name,
      }));
    });
  }

  async onSubmit() {
    try {
      const data = {
        author: this.form.value.author,
        title: this.form.value.title,
        content: this.form.value.content,
        category: doc(
          this.firestore,
          'articleCategory/' + this.form.value.category
        ),
        views: 0,
        uploaded: new Date(),
        status: 'Ditinjau',
      };
      this.articleService.addArticle(data);
      // await addDoc(collection(this.firestore, 'articles'), data);
      Swal.fire({
        title: 'Berhasil!',
        text: 'Berhasil mengirim artikel!',
        icon: 'success',
      }).then(() => {
        this.router.navigate(['lawlibrary/contribute/success']);
      });
    } catch (e) {
      console.error('Error adding document: ', e);
      Swal.fire({
        title: 'Oops...',
        text: 'Gagal mengirim artikel. Silakan coba lagi!',
        icon: 'error',
      });
    }
  }
}

export interface Category {
  value: string;
  viewValue: string;
}
