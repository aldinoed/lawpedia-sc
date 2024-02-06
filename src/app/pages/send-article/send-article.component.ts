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

@Component({
  selector: 'app-send-article',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditorModule],
  templateUrl: './send-article.component.html',
  styleUrl: './send-article.component.css',
})

export class SendArticleComponent implements OnInit {
  form: FormGroup;
  firestore: Firestore = inject(Firestore);

  // ARTICLE CATEGORY LIST
  // articleCategories = [
  //   'Hukum Internasional',
  //   'Hukum Bisnis',
  //   'Hukum Administrasi Negara',
  //   'Hukum Lingkungan',
  //   'Hukum Perdata',
  //   'Hukum Pertambangan',
  //   'Hukum Pidana',
  //   'Hukum Tata Negara',
  //   'Hukum Acaran',
  //   'Hukum Lainnya',
  // ];
  categories: Category[] = [];

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private articleService: ArticleService) {
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
      await addDoc(collection(this.firestore, 'articles'), {
        author: this.form.value.author,
        title: this.form.value.title,
        content: this.form.value.content,
        category: doc(this.firestore, 'articleCategory/' + this.form.value.category),
        views: 0,
        published: new Date(),
        // formatedPublished: new Date().toLocaleDateString(),
      });
      Swal.fire({
        title: 'Berhasil!',
        text: 'Berhasil publish artikel!',
        icon: 'success',
      }).then(() => {
        this.router.navigate(['article-sent']);
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


export interface Category {
  value: string;
  viewValue: string;
}