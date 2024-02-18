import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ShortNumberPipe } from '../../pipes/short-number.pipe';
import { RouterModule } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SpeakupService } from '../../services/speakup.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Firestore, doc } from '@angular/fire/firestore';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-speakup-threads-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    EditorModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxPaginationModule,
  ],
  templateUrl: './speakup-threads-list.component.html',
  styleUrl: './speakup-threads-list.component.css',
})
export class SpeakupThreadsListComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  threads: Array<any> = [];
  threadCategories: Array<any> = [];
  authenticatedUser: string = '';
  userAuthenticatedId: string = localStorage.getItem('uid') || '';
  threadForm: FormGroup;
  followForm: FormGroup;
  searchForm: FormGroup;
  searchKeyword: string = '';

  // CONSTRUCTOR
  constructor(
    private fb: FormBuilder,
    private speakupService: SpeakupService,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      searchKeyword: '',
    });
    this.threadForm = this.fb.group({
      title: '',
      content: '',
      category: '',
    });
    this.followForm = this.fb.group({
      categoryId: '',
      userId: this.userAuthenticatedId,
    });
    const uid = localStorage.getItem('uid') || '';
    this.authService.getUser(uid).then((user: any) => {
      this.authenticatedUser =
        user.data().username || user.data().fullname || user.data().email || '';
    });
  }

  // ON INIT
  ngOnInit(): void {
    this.loadSortedThreads();
    this.loadThreadCategories();
    initFlowbite(); //flowbite initiation
  }

  getInitialName(name: string): string {
    if (!name) return '';
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i].charAt(0);
    }

    return initials;
  }

  // CATEGORY SELECT
  selectedCategory = '';
  onCategoryChange() {
    this.loadSortedThreads();
  }

  // SORT SELECT
  sortLists: any[] = [
    { value: 1, viewValue: 'Waktu Publish Desc' },
    { value: 2, viewValue: 'Waktu Publish Asc' },
    { value: 3, viewValue: 'Jumlah View Desc' },
    { value: 4, viewValue: 'Jumlah View Asc' },
    { value: 5, viewValue: 'Title Desc' },
    { value: 6, viewValue: 'Title Asc' },
  ];
  selectedSort = 1;
  onSortChange() {
    this.loadSortedThreads();
  }

  onSearchSubmit(): void {
    this.searchKeyword = this.searchForm.value.searchKeyword;
    this.loadSortedThreads();
  }

  onThreadSubmit(): void {
    try {
      const categoryRef = '';
      if (this.threadForm.value.category !== '') {
        const categoryRef = doc(this.firestore, 'articleCategory/' + this.threadForm.value.category)
      } 
      this.speakupService.addSpeakupThread({
        content: this.threadForm.value.content,
        category: categoryRef,
        userId: localStorage.getItem('uid') || '',
        createdAt: new Date(),
      });
      Swal.fire({
        title: 'Berhasil!',
        text: 'Berhasil mengirim thread!',
        icon: 'success',
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        text: 'Gagal mengirim thread. Silakan coba lagi!',
        icon: 'error',
      });
      console.error('Error adding document: ', error);
    }
  }

  onFollow(categoryId: string): void {
    try {
      this.speakupService.followCategory(categoryId, this.userAuthenticatedId);
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        text: 'Gagal mengikuti kategori. Silakan coba lagi!',
        icon: 'error',
      });
      console.error('Error adding document: ', error);
    }
    this.loadThreadCategories();
    this.loadSortedThreads();
  }

  private loadThreadCategories(): void {
    this.speakupService.getThreadCategories().subscribe((data) => {
      data.map((category) => {
        this.speakupService
          .getCategoryFollowers(category.id)
          .subscribe((followers) => {
            category['followers'] = followers.length;
            followers.map((follower) => {
              if (follower['userId'] === this.userAuthenticatedId) {
                category['isFollowed'] = true;
              }
            });
          });
      });
      this.threadCategories = data;
      this.threadCategories.unshift({ id: '', name: 'Semua Kategori' });
    });
  }

  private loadSortedThreads(): void {
    this.speakupService.getSpeakupThreads().subscribe((threads) => {
      // Filter threads based on the search keyword
      if (this.searchKeyword) {
        threads = threads.filter((thread) =>
          thread['content']
            .toLowerCase()
            .includes(this.searchForm.value.searchKeyword.toLowerCase())
        );
      }

      // Filter threads based on the selected category
      if (this.selectedCategory) {
        threads = threads.filter(
          (thread) =>
            thread['category'].id ===
            this.threadCategories.find(
              (category) => category.id === this.selectedCategory
            )?.id
        );
      }

      // Sort threads based on the selected sort
      threads.sort((a, b) => {
        switch (this.selectedSort) {
          case 1:
            return b['createdAt'] - a['createdAt'];
          case 2:
            return a['createdAt'] - b['createdAt'];
          case 3:
            return b['views'] - a['views'];
          case 4:
            return a['views'] - b['views'];
          case 5:
            return b['title'].localeCompare(a['title']);
          case 6:
            return a['title'].localeCompare(b['title']);
          default:
            return 0;
        }
      });

      // Map threads with additional data
      threads.map((thread) => {
        this.authService.getUser(thread['userId']).then((user: any) => {
          thread['authorFullname'] = user.data().fullname || '';
          thread['authorUsername'] = user.data().username || '';
        });

        if (thread['category']) {
          this.speakupService
            .getThreadCategory(thread['category'])
            .then((category: any) => {
              thread['categoryName'] = category.data().name;
            });
        }

        this.speakupService
          .getSpeakupComments(thread.id)
          .subscribe((comments) => {
            thread['comments'] = comments;
            comments.map((comment) => {
              this.speakupService
                .getSpeakupReplies(thread.id, comment.id)
                .subscribe((replies) => {
                  comment['replies'] = replies;
                  replies.map((reply) => {
                    // console.log(reply);
                  });
                });
            });
          });
      });

      this.threads = threads;
    });
  }

  // PAGINATION
  p: number = 1;

  // CREATE THREADS MODAL
  createModalOpen: number = 0;
  setCreateModalOpen(isOpen: number) {
    this.createModalOpen = isOpen;
  }
}
