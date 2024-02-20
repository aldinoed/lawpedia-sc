import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { SpeakupService } from '../../services/speakup.service';
import { HoaxService } from '../../services/hoax.service';
import { ChatbotService } from '../../services/chatbot.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { RouterModule } from '@angular/router';;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  activeTab: string = '';
  articleLength!: number;
  speakupLength!: number;
  hoaxLength!: number;
  documentLength: number = 0;
  hoaxForm: FormGroup;
  analyticCards: Array<any> = [];

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private speakupService: SpeakupService,
    private hoaxService: HoaxService,
    private chatbotService: ChatbotService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.hoaxForm = this.formBuilder.group({
      author: '',
      title: '',
      content: '',
    });
  }

  ngOnInit(): void {
    
    initFlowbite();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getActiveTab();
      }
    });

    this.articleService.getArticles().subscribe((articles) => {
      this.articleLength = articles.length;
      // console.log('articleLength:', this.articleLength);
      this.analyticCards.push({
        name: 'Jumlah Artikel Terunggah',
        amount: this.articleLength,
      });
    });
 
    this.articleService.getArticleDrafts().subscribe((drafts) => {
      console.log('drafts:', drafts);
    });

    this.speakupService.getSpeakupThreads().subscribe((threads) => {
      this.speakupLength = threads.length;
      console.log('speakup:', threads);
      console.log('speakupLength:', this.speakupLength);
      this.analyticCards.push({
        name: 'Jumlah Speakup Threads Terunggah',
        amount: this.speakupLength,
      });
    });

    this.hoaxService.getHoaxList().subscribe((hoaxes) => {
      this.hoaxLength = hoaxes.length;
      console.log('hoaxes:', hoaxes);
      console.log('hoaxLength:', this.hoaxLength);
      this.analyticCards.push({
        name: 'Jumlah Informasi Hoaks Terunggah',
        amount: this.hoaxLength,
      });
    });

    this.chatbotService.getTopics().subscribe((topics) => {
      // console.log('topics:', topics);
      topics.forEach((topic) => {
        console.log('topic:', topic.path);
        this.chatbotService.getDocuments(topic.path).then((documents: any) => {
          console.log('topic', topic.name, 'panjang dokumen:', documents.prefixes.length);
          this.documentLength += documents.prefixes.length;
        });
      });
      this.analyticCards.push({
        name: 'Jumlah Dokumen Chatbot terunggah',
        amount: this.documentLength,
      });
    });
    
  }

  getActiveTab(): void {
    const path = this.route.snapshot.firstChild?.routeConfig?.path;
    if (path) {
      this.activeTab = path.split('/')[1]; // Ambil bagian kedua dari path untuk menentukan tab yang aktif
    }
  }

  // ANALYTIC CARD DATA
  // analyticCards: Array<any> = [
  //   {
  //     name: 'Jumlah artikel terunggah',
  //     amount: 755,
  //   },
  //   {
  //     name: 'Jumlah hoaks threads terunggah',
  //     amount: 755,
  //   },
  //   {
  //     name: 'Jumlah Speakup threads terunggah',
  //     amount: 755,
  //   },
  //   {
  //     name: 'Jumlah Sumber Literasi terunggah',
  //     amount: 755,
  //   },
  // ];

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