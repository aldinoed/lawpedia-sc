import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-speakup-threads-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, EditorModule],
  templateUrl: './speakup-threads-list.component.html',
  styleUrl: './speakup-threads-list.component.css',
})
export class SpeakupThreadsListComponent implements OnInit {

  // SPEAKUP THREADS LIST
  // speakupList: Array<any> = [
  //   {
  //     id: 1,
  //     user: 'John Doe',
  //     content:
  //       '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</p><br><p><b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</b></p>',
  //     comments: 50,
  //     views: 100,
  //     created_at: new Date(),
  //   },
  //   {
  //     id: 2,
  //     user: 'John Doe',
  //     content:
  //       '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</p><br><p><b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</b></p>',
  //     comments: 50,
  //     views: 100,
  //     created_at: new Date(),
  //   },
  //   {
  //     id: 3,
  //     user: 'John Doe',
  //     content:
  //       '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</p><br><p><b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</b></p>',
  //     comments: 50,
  //     views: 100,
  //     created_at: new Date(),
  //   },
  // ];

  // SEARCH FORM
  searchForm: FormGroup;
  searchKeyword: string = '';
  onSearchSubmit(): void {
    this.searchKeyword = this.searchForm.value.searchKeyword;
    // this.loadSortedArticles();
  }

  // CATEGORY LIST
  // categories: Array<any> = [
  //   {
  //     name: 'Kategori 1',
  //     followers: 100,
  //   },
  //   {
  //     name: 'Kategori 2',
  //     followers: 200,
  //   },
  //   {
  //     name: 'Kategori 3',
  //     followers: 150,
  //   },
  //   {
  //     name: 'Kategori 4',
  //     followers: 60,
  //   },
  // ];

  threads: Array<any> = [];
  threadCategories: Array<any> = []
  authenticatedUser: string = '';
  userAuthenticatedId: string = localStorage.getItem('uid') || '';
  threadForm: FormGroup;
  followForm: FormGroup;

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
      this.authenticatedUser = user.data().username || user.data().fullname || user.data().email || '';
    });
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

  onThreadSubmit(): void {
    try {
      this.speakupService.addSpeakupThread({
        title: this.threadForm.value.title || '',
        content: this.threadForm.value.content,
        category: this.threadForm.value.category || '',
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
      this.speakupService.followCategory(
        categoryId,
        this.userAuthenticatedId,
      );
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        text: 'Gagal mengikuti kategori. Silakan coba lagi!',
        icon: 'error',
      });
      console.error('Error adding document: ', error);
    }
  }
  

  // ON INIT
  ngOnInit(): void {
    this.speakupService.getSpeakupThreads().subscribe((data) => {
      data.map((thread) => {
        this.authService.getUser(thread['userId']).then((user: any) => {
          thread['authorFullname'] = user.data().fullname || '';
          thread['authorUsername'] = user.data().username || '';
        });

        this.speakupService.getThreadCategory(thread['category']).then((category: any) => {
          thread['categoryName'] = category.data().name || '';
        });

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
      this.threads = data;
      // console.log('threads: ', this.threads);
    });

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
      // console.log('categories: ', this.threadCategories);
    });

    // this.speakupService.getCategoryFollowings(this.userAuthenticatedId).subscribe((data: any) => {
    //   console.log('followings: ', data);
    // });

  }

}
