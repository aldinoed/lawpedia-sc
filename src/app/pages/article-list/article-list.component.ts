import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../services/article.service';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

interface Category {
  value: string;
  viewValue: string;
}
interface Sort {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css',
})
export class ArticleListComponent implements OnInit {
  articles: Observable<Article[]> = new Observable<Article[]>();
  popularArticles: Observable<Article[]> = new Observable<Article[]>();

  //Pagination Settings
  p: number = 1;
  collection: Array<any> = []; // contain articles

  // CATEGORY SELECT
  categories: Category[] = [
    { value: 'category1', viewValue: 'Category 1' },
    { value: 'category2', viewValue: 'Catgeory 2' },
    { value: 'category3', viewValue: 'Catgeory 3' },
  ]; // list of categories

  selectedCategory = ''; // keyword for filter category

  // SORT SELECT
  sortLists: Sort[] = [
    { value: 1, viewValue: 'Waktu Publish Desc' },
    { value: 2, viewValue: 'Waktu Publish Asc' },
    { value: 3, viewValue: 'Jumlah View Desc' },
    { value: 4, viewValue: 'Jumlah View Asc' },
    { value: 5, viewValue: 'Rating Desc' },
    { value: 6, viewValue: 'Rating Asc' },
  ]; // list of categories

  selectedSort = ''; // keyword for filter category
  sortForDatabase = {
    sortBy: '',
    method: '',
  };

  // SEARCH INPUT
  searchForm: any;
  finalSearchKeyword: string = '';  // keyword search database

  get searchKeyword() {
    return this.searchForm.get('searchKeyword');
  }

  onSearchSubmit() {
    this.finalSearchKeyword = this.searchForm.value;
  }

  // CONSTRUCTOR
  constructor(private articleService: ArticleService) {
    this.searchForm = new FormGroup({
      searchKeyword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.articles = this.articleService.getArticles();
    this.popularArticles = this.articleService.getPopularArticles();

    // convert observable to object and assign it to collection
    this.articleService.getArticles().subscribe((articles) => {
      this.collection = articles.map((article) => ({
        id: article.id,
        title: article.title,
        content: article.content,
        category: article.category,
        views: article.views,
        published: article.published,
      }));
    });
    this.articles.subscribe((articles: Article[]) => console.log('Articles:', articles));
  }
}
