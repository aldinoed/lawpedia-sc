import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../services/article.service';
import { ArticleCategory } from '../../services/article.service';
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
import { FormBuilder } from '@angular/forms';

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
  rating: Observable<number> = new Observable<number>();
  ratings: number[] = [];

  // PAGINATION
  p: number = 1;
  collection: Array<any> = [];

  getCleanContent(content: string): string {
    // Bersihkan tag <img> dari konten
    const cleanContent = content.replace(/<img[^>]*>/g, '');
    return cleanContent;
  }

  // CATEGORY SELECT
  categories: Category[] = [];
  selectedCategory = '';
  onCategoryChange() {
    console.log(this.selectedCategory);
    this.loadSortedArticles();
  }

  // SORT SELECT
  sortLists: Sort[] = [
    { value: 1, viewValue: 'Waktu Publish Desc' },
    { value: 2, viewValue: 'Waktu Publish Asc' },
    { value: 3, viewValue: 'Jumlah View Desc' },
    { value: 4, viewValue: 'Jumlah View Asc' },
    { value: 5, viewValue: 'Title Desc' },
    { value: 6, viewValue: 'Title Asc' },
  ];
  selectedSort = 1;
  onSortChange() {
    this.loadSortedArticles();
  }

  // SEARCH INPUT
  searchForm: FormGroup;
  searchKeyword: string = '';
  onSearchSubmit(): void {
    this.searchKeyword = this.searchForm.value.searchKeyword;
    this.loadSortedArticles();
  }

  // CONSTRUCTOR
  constructor(private articleService: ArticleService, private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchKeyword: '',
    });
  }

  // INIT
  ngOnInit() {
    this.loadSortedArticles();
    this.articleService.getArticleCategories().subscribe((categories) => {
      this.categories = categories.map((category) => ({
        value: category.id,
        viewValue: category.name,
      }));
      this.categories.unshift({ value: '', viewValue: 'Semua Kategori' });
    });
  }

  // LOAD SORTED ARTICLES
  private loadSortedArticles() {
    this.articleService.getArticles().subscribe((articles) => {
      // Filter articles based on the selected category

      let filteredArticles = articles;
      if (this.selectedCategory) {
        filteredArticles = articles.filter(
          (article) =>
            article.category ===
            this.categories.find(
              (category) => category.value === this.selectedCategory
            )?.viewValue
        );
      }

      // Filter articles based on the search keyword
      if (this.searchKeyword) {
        filteredArticles = articles.filter(
          (article) =>
            article.title
              .toLowerCase()
              .includes(this.searchForm.value.searchKeyword.toLowerCase()) ||
            article.content
              .toLowerCase()
              .includes(this.searchForm.value.searchKeyword.toLowerCase())
        );
      }

      // Sort articles based on the selected sort method
      filteredArticles.sort((a, b) => {
        if (this.selectedSort === 1) {
          return b.published.seconds - a.published.seconds;
        } else if (this.selectedSort === 2) {
          return a.published.seconds - b.published.seconds;
        } else if (this.selectedSort === 3) {
          return b.views - a.views;
        } else if (this.selectedSort === 4) {
          return a.views - b.views;
        } else if (this.selectedSort === 5) {
          return b.title.localeCompare(a.title);
        } else if (this.selectedSort === 6) {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });

      // Get the ratings and subscribe to the Observable<number>
      filteredArticles.map((article) =>
        this.articleService
          .getArticleRating(article.id)
          .subscribe((rating) => this.ratings.push(rating))
      );

      // Map articles for display
      this.collection = filteredArticles.map((article) => ({
        id: article.id,
        title: article.title,
        author: article.author,
        content: this.getCleanContent(article.content),
        category: article.category,
        views: article.views,
        published: article.published.toDate(),
      }));
    });
  }

  // TABS (Artikel - Kontribusi)
  activeTab: string = 'artikel';

  onTabClick(content: string) {
    this.activeTab = content;
  }
}
