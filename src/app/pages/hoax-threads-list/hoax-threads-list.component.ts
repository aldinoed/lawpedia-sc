import { Component, OnInit } from '@angular/core';
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
import { HoaxService } from '../../services/hoax.service';
import { Hoax } from '../../services/hoax.service';

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

export class HoaxThreadsListComponent implements OnInit {
  hoaxList: Array<any> = [];

  // PAGINATION
  p: number = 1;
  // collection: Array<any> = [
  //   {
  //     id: 1,
  //     title: 'Ini Judul',
  //     content: '<p>Ini Content</p>',
  //     category: 'Hukum Internasional',
  //     views: 100,
  //     published: new Date(),
  //   },
  //   {
  //     id: 2,
  //     title: 'Ini Judul',
  //     content: '<p>Ini Content kabbkabka kbdvkbajvbak kjbavjkbkajbvkad kabvajbvbadvlj kabvabvkdabvjda</p>',
  //     category: 'Hukum Internasional',
  //     views: 100,
  //     published: new Date(),
  //   },
  // ];

  // CATEGORY SELECT
  // categories: Category[] = [];
  categories: Category[] = [
    { value: 'all', viewValue: 'Semua' },
    { value: 'today', viewValue: 'Hari Ini' },
    { value: 'this-week', viewValue: 'Minggu Ini' },
    { value: 'this-month', viewValue: 'Bulan Ini' },
  ];
  selectedCategory = 'all';
  onCategoryChange() {
    console.log(this.selectedCategory);
    this.loadSortedHoaxList();
  }

  // SORT SELECT
  sortLists: Sort[] = [
    { value: 1, viewValue: 'Waktu Publish Desc' },
    { value: 2, viewValue: 'Waktu Publish Asc' },
    { value: 3, viewValue: 'Jumlah View Desc' },
    { value: 4, viewValue: 'Jumlah View Asc' },
  ];
  selectedSort = 1;
  onSortChange() {
    console.log(this.selectedSort);
    this.loadSortedHoaxList();
  }

  // SEARCH INPUT
  searchForm: FormGroup;
  searchKeyword: string = '';
  onSearchSubmit(): void {
    this.searchKeyword = this.searchForm.value.searchKeyword;
    this.loadSortedHoaxList();
  }

  // CONSTRUCTOR
  constructor(
    private fb: FormBuilder,
    private hoaxService: HoaxService) {
    this.searchForm = this.fb.group({
      searchKeyword: '',
    });
  }
  
  // INIT
  ngOnInit() {
    this.loadSortedHoaxList();
  }

  // LOAD SORTED HOAX
  private loadSortedHoaxList() {
    this.hoaxService.getHoaxList().subscribe((hoaxList) => {

      // Filter hoax based on the selected category
      if (this.selectedCategory === 'today') {
        hoaxList = hoaxList.filter((hoax) => {
          const today = new Date();
          return (
            hoax.published.toDate().toDateString() === today.toDateString()
          );
        });
      } else if (this.selectedCategory === 'this-week') {
        hoaxList = hoaxList.filter((hoax) => {
          const today = new Date();
          const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
          const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
          return (
            hoax.published.toDate() >= firstDay &&
            hoax.published.toDate() <= lastDay
          );
        });
      } else if (this.selectedCategory === 'this-month') {
        hoaxList = hoaxList.filter((hoax) => {
          const today = new Date();
          const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
          const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 30));
          return (
            hoax.published.toDate() >= firstDay &&
            hoax.published.toDate() <= lastDay
          );
        });
     }
      
      // Filter hoax based on the search keyword
      if (this.searchKeyword) {
        hoaxList = hoaxList.filter(
          (hoax) => 
          hoax.title
            .toLowerCase()
            .includes(this.searchForm.value.searchKeyword.toLowerCase()) ||
          hoax.content
            .toLowerCase()
            .includes(this.searchForm.value.searchKeyword.toLowerCase())
        );
      }

      // Sort hoax based on the selected sort
      hoaxList.sort((a, b) => {
        if (this.selectedSort === 1) {
          return b.published.seconds - a.published.seconds;
        } else if (this.selectedSort === 2) {
          return a.published.seconds - b.published.seconds;
        } else if (this.selectedSort === 3) {
          return b.views - a.views;
        } else if (this.selectedSort === 4) {
          return a.views - b.views;
        }
        return 0;
      });

      // Map the hoaxList to the component's hoaxList
      this.hoaxList = hoaxList.map((hoax) => ({
        id: hoax.id,
        title: hoax.title,
        content: hoax.content,
        views: hoax.views,
        published: hoax.published.toDate(),
        images: hoax.images,
      }));

      this.hoaxList.forEach((hoax) => {
        this.hoaxService.getContentImages(hoax.id).subscribe((images) => {
          hoax.images = images;
        });
      });

      // this.hoaxService.getContentImages(this.hoaxList[1].id).subscribe((images) => {
      //   this.hoaxList[1].images = images;
      // });
      console.log(this.hoaxList);
    });
  }
}
