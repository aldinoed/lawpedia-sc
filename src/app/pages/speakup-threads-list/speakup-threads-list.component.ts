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

@Component({
  selector: 'app-speakup-threads-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, EditorModule],
  templateUrl: './speakup-threads-list.component.html',
  styleUrl: './speakup-threads-list.component.css',
})
export class SpeakupThreadsListComponent implements OnInit {
  getInitialName(name: string): string {
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i].charAt(0);
    }

    return initials;
  }

  // SPEAKUP THREADS LIST
  speakupList: Array<any> = [
    {
      id: 1,
      user: 'John Doe',
      content:
        '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</p><br><p><b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</b></p>',
      comments: 50,
      views: 100,
      created_at: new Date(),
    },
    {
      id: 2,
      user: 'John Doe',
      content:
        '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</p><br><p><b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</b></p>',
      comments: 50,
      views: 100,
      created_at: new Date(),
    },
    {
      id: 3,
      user: 'John Doe',
      content:
        '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</p><br><p><b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</b></p>',
      comments: 50,
      views: 100,
      created_at: new Date(),
    },
  ];

  // SEARCH FORM
  searchForm: FormGroup;
  searchKeyword: string = '';
  onSearchSubmit(): void {
    this.searchKeyword = this.searchForm.value.searchKeyword;
    // this.loadSortedArticles();
  }

  // CATEGORY LIST
  categories: Array<any> = [
    {
      name: 'Kategori 1',
      followers: 100,
    },
    {
      name: 'Kategori 2',
      followers: 200,
    },
    {
      name: 'Kategori 3',
      followers: 150,
    },
    {
      name: 'Kategori 4',
      followers: 60,
    },
  ];

  threads: Array<any> = [];
  threadCategories: Array<any> = [] 

  // CONSTRUCTOR
  constructor(
    private fb: FormBuilder,
    private speakupService: SpeakupService
  ) {
    this.searchForm = this.fb.group({
      searchKeyword: '',
    });
  }

  getInitialName(name: string): string {
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i].charAt(0);
    }

    return initials;
  }

  // ON INIT
  ngOnInit(): void {
    this.speakupService.getSpeakupThreads().subscribe((data) => {
      data.map((thread) => {
        this.speakupService
        .getSpeakupThread(thread.id)
        .subscribe((comments) => {
          thread['comments'] = comments;
          comments.map((comment) => {
            this.speakupService
              .getSpeakupReply(thread.id, comment.id)
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
      console.log('threads: ', this.threads);
    });
    
    this.speakupService.getThreadCategories().subscribe((data) => {
      data.map((category) => {
        this.speakupService
        .getThreadCategory(category.id)
        .subscribe((followers) => {
          category['followers'] = followers.length;
        });
      });
      this.threadCategories = data;
      console.log('categories: ', this.threadCategories);
    });
    
  }

}
