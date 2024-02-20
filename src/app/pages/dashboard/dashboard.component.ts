import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { SpeakupService } from '../../services/speakup.service';
import { HoaxService } from '../../services/hoax.service';
import { ChatbotService } from '../../services/chatbot.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // BrowserModule,
    DataTablesModule,
    MatTableModule,
    MatPaginatorModule,
    EditorModule,
  ],
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

  currentPath: string = '';

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
    private router: Router
  ) {
    this.hoaxForm = this.formBuilder.group({
      author: '',
      title: '',
      content: '',
    });

    this.currentPath = this.router.url;
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  // ngOnDestroy() {
  //   this.event$.unsubscribe();
  // }

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
          console.log(
            'topic',
            topic.name,
            'panjang dokumen:',
            documents.prefixes.length
          );
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
  articleSearchInput = '';

  articles: Array<any> = [
    {
      title: 'Lorem ipsum dolor sit amet',
      status: 'diterima',
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      status: 'diterima',
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      status: 'ditinjau',
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      status: 'ditinjau',
    },
    {
      title: 'Hukum Mendukung Israel',
      status: 'ditinjau',
    },
    {
      title: 'Hukum Korupsi Uang Beasiswa',
      status: 'ditinjau',
    },
  ];

  // HOAX SECTION
  private createHoax() {
    const data = {
      author: this.hoaxForm.value.author,
      title: this.hoaxForm.value.title,
      content: this.hoaxForm.value.content,
      published: new Date(),
      views: 0,
    };
    this.hoaxService.addHoax(data);
  }

  private updateHoax(hoaxId: string) {
    const data = {
      author: this.hoaxForm.value.author,
      title: this.hoaxForm.value.title,
      content: this.hoaxForm.value.content,
    };
    this.hoaxService.updateHoax(data, hoaxId);
  }

  hoaxSearchInput = '';

  hoaxList: Array<any> = [
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
  ];

  createLawfactClicked: boolean = false;
  onCreateLawfactClick(status: boolean) {
    this.createLawfactClicked = status;
  }

  // SPEAKUP SECTION
  speakupSearchInput = '';

  speakupList: Array<any> = [
    {
      username: 'John Doe',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
    {
      username: 'John Doe',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
    {
      username: 'John Doe',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
    {
      username: 'John Doe',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
    {
      username: 'John Doe',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
    },
  ];

  // CHATBOT SECTION
  chatbotSearchInput = '';

  chatbotList: Array<any> = [
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
      category: 'Hukum Tata Negara',
    },
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
      category: 'Hukum Tata Negara',
    },
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
      category: 'Hukum Tata Negara',
    },
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
      category: 'Hukum Tata Negara',
    },
    {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit.',
      category: 'Hukum Tata Negara',
    },
  ];

  createLawbotClicked: boolean = false;
  onCreateLawbotClick(status: boolean) {
    this.createLawbotClicked = status;
  }
}
