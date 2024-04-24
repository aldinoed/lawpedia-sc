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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EditorModule } from '@tinymce/tinymce-angular';
import Swal from 'sweetalert2';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CKEditorModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // BrowserModule,
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
  documentLength!: number;
  hoaxForm: FormGroup;
  chatbotForm: FormGroup;
  articleSearchForm: FormGroup;
  hoaxSearchForm: FormGroup;
  speakupSearchForm: FormGroup;
  chatbotSearchForm: FormGroup;
  analyticCards: Array<any> = [];
  articleDrafts: Array<any> = [];
  hoaxList: Array<any> = [];
  speakupList: Array<any> = [];
  chatbotList: Array<any> = [];
  chatbotCategories: Array<any> = [];

  currentPath: string = '';

  public Editor = ClassicEditor;

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
      media: '',
    });
    this.chatbotForm = this.formBuilder.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
    });
    this.articleSearchForm = this.formBuilder.group({
      searchKeyword: '',
    });
    this.hoaxSearchForm = this.formBuilder.group({
      searchKeyword: '',
    });
    this.speakupSearchForm = this.formBuilder.group({
      searchKeyword: '',
    });
    this.chatbotSearchForm = this.formBuilder.group({
      searchKeyword: '',
    });

    this.currentPath = this.router.url;
  }
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }

  // ngOnDestroy() {
  //   this.event$.unsubscribe();
  // }

  ngOnInit(): void {
    initFlowbite();
    this.router.navigateByUrl(this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getActiveTab();
      }
    });

    this.articleService.getArticles().subscribe((articles) => {
      this.articleLength = articles.length;
      this.analyticCards.push({
        name: 'Jumlah Artikel Terunggah',
        amount: this.articleLength,
      });
    });

    this.loadArticleDrafts();

    this.loadSpeakupThreads();

    this.loadHoaxes();

    this.loadChatbotDocuments();
  }

  getActiveTab(): void {
    const path = this.route.snapshot.firstChild?.routeConfig?.path;
    if (path) {
      this.activeTab = path.split('/')[1]; // Ambil bagian kedua dari path untuk menentukan tab yang aktif
    }
  }

  // ARTICLE SECTION
  private loadArticleDrafts() {
    this.articleDrafts = [];
    this.articleService.getArticleDrafts().subscribe((drafts) => {
      // Filter articles based on the search keyword
      if (this.articleSearchInput) {
        drafts = drafts.filter((draft) =>
          draft.title
            .toLowerCase()
            .includes(this.articleSearchForm.value.searchKeyword.toLowerCase())
        );
      }
      this.articleDrafts = drafts;
    });
  }

  onPreviewArticle(articleId: string) {
    this.articleService.getArticleDraft(articleId).subscribe((article) => {
      Swal.fire({
        title: article.title,
        html: `<div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">${article.content}</div>`,
        showCloseButton: true,
        showConfirmButton: false,
      });
    });
  }

  onAcceptArticle(articleId: string) {
    this.articleService.publishArticle(articleId);
  }

  articleSearchInput = '';
  onSearchArticle() {
    this.articleSearchInput = this.articleSearchForm.value.searchKeyword;
    this.loadArticleDrafts();
  }

  // HOAX SECTION
  onCreateHoax() {
    const userId = localStorage.getItem('uid') || '';
    this.authService.getUser(userId).then((user: any) => {
      const data = {
        author: user.data().username,
        title: this.hoaxForm.value.title,
        content: this.hoaxForm.value.content,
        file: this.hoaxMedia,
        published: new Date(),
        views: 0,
      };
      this.hoaxService.addHoax(data).then(() => {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data berhasil ditambahkan.',
          icon: 'success',
        });
      });
      // console.log('data:', data);
    });
  }

  deleteHoax(hoaxId: string) {
    this.hoaxService.deleteHoax(hoaxId);
  }

  hoaxMedia: File | null = null;
  async handleFileHoaxInput(event: any) {
    this.hoaxMedia = event.target.files[0];
  }

  private updateHoax(hoaxId: string) {
    const data = {
      author: this.hoaxForm.value.author,
      title: this.hoaxForm.value.title,
      content: this.hoaxForm.value.content,
    };
    this.hoaxService.updateHoax(data, hoaxId);
  }

  private loadHoaxes() {
    this.hoaxList = [];
    this.hoaxService.getHoaxList().subscribe((hoaxes) => {
      // Filter hoaxes based on the search keyword
      // console.log('hoaxSearchInput:', this.hoaxSearchInput);
      if (this.hoaxSearchInput) {
        hoaxes = hoaxes.filter((hoax) =>
          hoax.title
            .toLowerCase()
            .includes(this.hoaxSearchForm.value.searchKeyword.toLowerCase())
        );
      }

      this.hoaxLength = hoaxes.length;
      this.analyticCards.push({
        name: 'Jumlah Informasi Hoaks Terunggah',
        amount: this.hoaxLength,
      });

      this.hoaxList = hoaxes;
      // console.log('hoaxList:', this.hoaxList);
    });
  }

  hoaxSearchInput = '';
  onSearchHoax() {
    this.hoaxSearchInput = this.hoaxSearchForm.value.searchKeyword;
    this.loadHoaxes();
  }

  createLawfactClicked: boolean = false;
  onCreateLawfactClick(status: boolean) {
    this.createLawfactClicked = status;
  }

  onLawfactDeleteClick(id: string) {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data tidak akan bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteHoax(id);

        Swal.fire({
          title: 'Berhasil!',
          text: 'Data berhasil dihapus.',
          icon: 'success',
        });
      }
    });
  }

  // SPEAKUP SECTION
  private loadSpeakupThreads() {
    this.speakupList = [];
    this.speakupService.getSpeakupThreads().subscribe((threads) => {
      this.speakupLength = threads.length;
      this.analyticCards.push({
        name: 'Jumlah Speakup Threads Terunggah',
        amount: this.speakupLength,
      });

      threads.map((thread) => {
        this.authService.getUser(thread['userId']).then((user: any) => {
          thread['authorUsername'] = user.data().username || '';
          thread['authorFullname'] = user.data().fullname || '';
        });
      });

      // Filter threads based on the search keyword
      if (this.speakupSearchInput) {
        threads = threads.filter((thread) =>
          thread['id']
            .toLowerCase()
            .includes(this.speakupSearchForm.value.searchKeyword.toLowerCase())
        );
      }
      this.speakupList = threads;
      // console.log('speakupList:', this.speakupList);
    });
  }

  deleteSpeakupThread(threadId: string) {
    this.speakupService.deleteSpeakupThread(threadId);
  }

  speakupSearchInput = '';
  onSearchSpeakup() {
    this.speakupSearchInput = this.speakupSearchForm.value.searchKeyword;
    this.loadSpeakupThreads();
  }

  onLawspeakDeleteClick(id: string) {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data tidak akan bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSpeakupThread(id);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data berhasil dihapus.',
          icon: 'success',
        });
      }
    });
  }

  // CHATBOT SECTION
  chatbotSearchInput = '';
  onSearchChatbot() {
    this.chatbotSearchInput = this.chatbotSearchForm.value.searchKeyword;
    this.loadChatbotDocuments();
  }

  private loadChatbotTopics() {
  }

  private loadChatbotDocuments() {
    this.chatbotList = [];
    this.chatbotService.getTopics().subscribe((topics) => {
      this.chatbotCategories = topics;
      const promises = topics.map((topic) => {
        return this.chatbotService.getDocuments(topic.path).then((documents: any) => {
          return Promise.all(documents.items.map((item: any) => {
            return this.chatbotService.getDownloadUrl(item._location.path).then((url: any) => {
              const data = {
                filename: item._location.path.split('/').pop(),
                category: topic.name,
                url: url,
                path: item._location.path,
              };
              this.chatbotList.push(data);
            });
          }));
        });
      });
  
      Promise.all(promises).then(() => {
        // Filter chatbotList if search input is provided
        if (this.chatbotSearchInput) {
          this.chatbotList = this.chatbotList.filter((doc) =>
            doc.filename
              .toLowerCase()
              .includes(this.chatbotSearchForm.value.searchKeyword.toLowerCase()) ||
            doc.category
              .toLowerCase()
              .includes(this.chatbotSearchForm.value.searchKeyword.toLowerCase())
          );
        }
  
        this.analyticCards.push({
          name: 'Jumlah Dokumen Chatbot terunggah',
          amount: this.chatbotList.length,
        });
      });
    });
  }
  


  chatbotDoc: File | null = null;
  async handleFileChatbotInput(event: any) {
    this.chatbotDoc = event.target.files[0];
  }

  onCreateDocument() {
    if (this.chatbotDoc && this.chatbotForm.valid) {
      const userId = localStorage.getItem('uid') || '';
      this.authService.getUser(userId).then((user: any) => {
        const data = {
          title: this.chatbotForm.value.title,
          topic: this.chatbotForm.value.category,
          file: this.chatbotDoc,
          published: new Date(),
        };

        this.chatbotService.addNewDocument(data).then(() => {
          Swal.fire({
            title: 'Berhasil!',
            text: 'Data berhasil ditambahkan.',
            icon: 'success',
          });
          this.onCreateLawbotClick(false);
          this.loadChatbotDocuments();
        }).catch((error) => {
          console.error('Error adding document:', error);
          Swal.fire({
            title: 'Gagal!',
            text: 'Data gagal ditambahkan.',
            icon: 'error',
          });
        });
      });
    } else {
      Swal.fire({
        title: 'Gagal!',
        text: 'Data tidak lengkap.',
        icon: 'error',
      });
    }
  }
  createLawbotClicked: boolean = false;
  onCreateLawbotClick(status: boolean) {
    this.createLawbotClicked = status;
  }

  onLawbotDeleteClick(path: string) {
    Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data tidak akan bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.chatbotService.deleteDocument(path);
        this.loadChatbotDocuments();
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data berhasil dihapus.',
          icon: 'success',
        });
      }
    });
  }
}
