import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SpeakupService } from '../../services/speakup.service';
import { AuthService } from '../../services/auth.service';
import { Form, FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-speakup-thread-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './speakup-thread-detail.component.html',
  styleUrl: './speakup-thread-detail.component.css',
})
export class SpeakupThreadDetailComponent implements OnInit {
  getInitialName(name: string): string {
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i].charAt(0);
    }

    return initials;
  }

  userAuthenticatedId: string = localStorage.getItem('uid') || '';
  threadData: any = {};
  threadCategories: Array<any> = [];
  updateForm: FormGroup;
  commentForm: FormGroup;
  replyForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private speakupService: SpeakupService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      content: '',
    });
    this.commentForm = this.fb.group({
      content: '',
    });
    this.replyForm = this.fb.group({
      content: '',
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.speakupService.getSpeakupThread(id).then((thread) => {
      this.threadData = thread.data();
      this.authService.getUser(this.threadData.userId).then((user: any) => {
        this.threadData.authorUsername = user.data().username || '';
        this.threadData.authorFullname = user.data().fullname || '';
      });

      this.speakupService.getSpeakupUpdates(id).subscribe((updates) => {
        this.threadData.updates = updates.sort((a, b) => a['createdAt'] - b['createdAt']);
      });

      this.speakupService.getSpeakupComments(id).subscribe((comments) => {
        comments.map((comment) => {
          this.authService.getUser(comment['userId']).then((user: any) => {
            comment['authorUsername'] = user.data().username || '';
            comment['authorFullname'] = user.data().fullname || '';
          });
          this.speakupService.getSpeakupReplies(id, comment['id']).subscribe((replies) => {
            replies.map((reply) => {
              this.authService.getUser(reply['userId']).then((user: any) => {
                reply['authorUsername'] = user.data().username || '';
                reply['authorFullname'] = user.data().fullname || '';
              });
            });
            comment['replies'] = replies.sort((a, b) => a['createdAt'] - b['createdAt']);
          });
        });
        this.threadData.comments = comments.sort((a, b) => b['createdAt'] - a['createdAt']);
      });

      console.log(this.threadData);
    });

    this.speakupService.getThreadCategories().subscribe((data) => {
      data.map((category) => {
        this.speakupService
        .getCategoryFollowers(category.id)
        .subscribe((followers) => {
          category['followers'] = followers.length;
        });
      });
      this.threadCategories = data;
      console.log('categories: ', this.threadCategories);
    });
    
  }

  onUpdateSubmit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    try {
      this.speakupService.addSpeakupUpdate(id, {
        content: this.updateForm.value.content,
        createdAt: new Date(),
      });
      // window.location.reload();
      this.updateForm.reset();
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        text: 'Gagal mengirim update. Silakan coba lagi!',
        icon: 'error',
      });
      console.error('Error adding document: ', error);
    }
  }

  onCommentSubmit() {
    const id = this.route.snapshot.paramMap.get('id') || '';
    try {
      this.speakupService.addSpeakupComment(id, {
        content: this.commentForm.value.content,
        createdAt: new Date(),
        userId: localStorage.getItem('uid'),
      });
      // window.location.reload();
      this.commentForm.reset();
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        text: 'Gagal mengirim komentar. Silakan coba lagi!',
        icon: 'error',
      });
      console.error('Error adding document: ', error);
    }
  }

  onReplySubmit(commentId: string) {
    const id = this.route.snapshot.paramMap.get('id') || '';
    try {
      this.speakupService.addSpeakupReply(id, commentId, {
        content: this.replyForm.value.content,
        createdAt: new Date(),
        userId: localStorage.getItem('uid'),
      });
      // window.location.reload();
      this.replyForm.reset();
    } catch (error) {
      Swal.fire({
        title: 'Oops...',
        text: 'Gagal mengirim balasan. Silakan coba lagi!',
        icon: 'error',
      });
      console.error('Error adding document: ', error);
    }
  }
}
