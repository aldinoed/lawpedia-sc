import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
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
import { get } from '@angular/fire/database';

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
  articles: Array<any> = [];
  popularArticles: Array<any> = [];
  rating: Observable<number> = new Observable<number>();
  ratings: number[] = [];

  // PAGINATION
  p: number = 1;

  // CATEGORY SELECT
  categories: Category[] = [];
  selectedCategory = '';
  onCategoryChange() {
    this.loadSortedArticles();
  }

  // SORT SELECT
  sortLists: Sort[] = [
    { value: 1, viewValue: 'Terbaru' },
    { value: 2, viewValue: 'Terlama' },
    { value: 3, viewValue: 'Dilihat Terbanyak' },
    { value: 4, viewValue: 'Dilihat Terendah' },
    { value: 5, viewValue: 'Rating Terbanyak' },
    { value: 6, viewValue: 'Rating Terendah' },
    { value: 7, viewValue: 'Hot & New' }
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
      if (this.selectedCategory) {
        articles = articles.filter(
          (article) =>
            article.category ===
            this.categories.find(
              (category) => category.value === this.selectedCategory
            )?.viewValue
        );
      }

      // Filter articles based on the search keyword
      if (this.searchKeyword) {
        articles = articles.filter(
          (article) =>
            article.title
              .toLowerCase()
              .includes(this.searchForm.value.searchKeyword.toLowerCase()) ||
            article.content
              .toLowerCase()
              .includes(this.searchForm.value.searchKeyword.toLowerCase())
        );
      }

      // Map articles for display
      this.articles = articles.map((article) =>
      (this.articleService
        .getArticleRating(article.id)
        .subscribe((rating: number) => {
          article.rating = rating ? rating : 0;
        }), {
        id: article.id,
        title: article.title,
        author: article.author,
        content: this.articleService.getCleanContent(article.content),
        category: article.category,
        views: article.views,
        published: article.published.toDate(),
      })
      );

      // Get the ratings and subscribe to the Observable<number>
      this.articles.map((article) =>
        this.articleService
          .getArticleRating(article.id)
          .subscribe((rating: number) => {
            article.rating = rating ? rating : 0;
          })
      );

      // articles.forEach((article) => {
      //   this.articleService.getArticleRating(article.id).subscribe((rating: number) => {
      //     article.rating = rating ? rating : 0;

      //   });
      // });


      // Sort articles based on the selected sort method
      this.articles.sort((a, b) => {
        if (this.selectedSort === 1) {
          return b.published - a.published;
        } else if (this.selectedSort === 2) {
          return a.published - b.published;
        } else if (this.selectedSort === 3) {
          return b.views - a.views;
        } else if (this.selectedSort === 4) {
          return a.views - b.views;
        } else if (this.selectedSort === 5) {
          return b.rating - a.rating;
        } else if (this.selectedSort === 6) {
          return a.rating - b.rating;
        } else if (this.selectedSort === 7) {
          return b.views - a.views && b.published - a.published;
        }
        return 0;
      });
    });
  }


  // LOAD POPULAR ARTICLES
  private loadPopularArticles() {
    this.articleService.getPopularArticles().subscribe((articles) => {
      articles.sort((a, b) => b.views - a.views);
      this.popularArticles = articles.map((article) => ({
        id: article.id,
        title: article.title,
        author: article.author,
        content: this.articleService.getCleanContent(article.content),
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
