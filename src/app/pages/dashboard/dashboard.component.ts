import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { SpeakupService } from '../../services/speakup.service';
import { HoaxService } from '../../services/hoax.service';
import { ChatbotService } from '../../services/chatbot.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  articleLength!: number;
  speakupLength!: number;
  hoaxLength!: number;
  hoaxForm: FormGroup;

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private speakupService: SpeakupService,
    private hoaxService: HoaxService,
    private chatbotService: ChatbotService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.hoaxForm = this.formBuilder.group({
      author: '',
      title: '',
      content: '',
    });
  }

  ngOnInit(): void {
    this.articleService.getArticles().subscribe((articles) => {
      this.articleLength = articles.length;
      console.log('articleLength:', this.articleLength);
    });
 
    this.articleService.getArticleDrafts().subscribe((drafts) => {
      console.log('drafts:', drafts);
    });

    this.speakupService.getSpeakupThreads().subscribe((threads) => {
      this.speakupLength = threads.length;
      console.log('speakup:', threads);
      console.log('speakupLength:', this.speakupLength);
    });

    this.hoaxService.getHoaxList().subscribe((hoaxes) => {
      this.hoaxLength = hoaxes.length;
      console.log('hoaxes:', hoaxes);
      console.log('hoaxLength:', this.hoaxLength);
    });

    this.chatbotService.getTopics().subscribe((topics) => {
      console.log('topics:', topics);
      topics.forEach((topic) => {
        console.log('topic:', topic.path);
      });
    });
    
  }
  // ARTICLE SECTION


  // HOAX SECTION
  private createHoax() {
    const data = {
      author: this.hoaxForm.value.author,
      title: this.hoaxForm.value.title,
      content: this.hoaxForm.value.content,
      published: new Date(),
      views: 0,
    }
    this.hoaxService.addHoax(data);
  }

  private updateHoax(hoaxId: string) {
    const data = {
      author: this.hoaxForm.value.author,
      title: this.hoaxForm.value.title,
      content: this.hoaxForm.value.content,
    }
    this.hoaxService.updateHoax(data, hoaxId);
  }

  // SPEAKUP SECTION



  // CHATBOT SECTION


}