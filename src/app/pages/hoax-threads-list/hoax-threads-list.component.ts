import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

interface Category {
  value: string;
  viewValue: string;
}
interface Sort {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-hoax-threads-list',
  standalone: true,
  imports: [
    RouterModule,
    NgxPaginationModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './hoax-threads-list.component.html',
  styleUrl: './hoax-threads-list.component.css',
})
export class HoaxThreadsListComponent {
  // PAGINATION
  p: number = 1;
  collection: Array<any> = [
    {
      id: 1,
      title: 'Ini Judul',
      content: '<p>Ini Content</p>',
      category: 'Hukum Internasional',
      views: 100,
      published: new Date(),
    },
    {
      id: 2,
      title: 'Ini Judul',
      content: '<p>Ini Content kabbkabka kbdvkbajvbak kjbavjkbkajbvkad kabvajbvbadvlj kabvabvkdabvjda</p>',
      category: 'Hukum Internasional',
      views: 100,
      published: new Date(),
    },
  ];

  // CATEGORY SELECT
  // categories: Category[] = [];
  categories: Category[] = [
    { value: 'id1', viewValue: 'Hukum Bisnis' },
    { value: 'id1', viewValue: 'Hukum Tata Negara' },
    { value: 'id1', viewValue: 'Hukum Internasional' },
    { value: 'id1', viewValue: 'Hukum Lingkungan' },
    { value: 'id1', viewValue: 'Hukum Lainnya' },
  ];
  selectedCategory = '';
  onCategoryChange() {
    console.log(this.selectedCategory);
    // this.loadSortedArticles();
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
    console.log(this.selectedSort);
    // this.loadSortedArticles();
  }

  // SEARCH INPUT
  searchForm: FormGroup;
  searchKeyword: string = '';
  onSearchSubmit(): void {
    this.searchKeyword = this.searchForm.value.searchKeyword;
    // this.loadSortedArticles();
  }

  // CONSTRUCTOR
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      searchKeyword: '',
    });
  }
}
