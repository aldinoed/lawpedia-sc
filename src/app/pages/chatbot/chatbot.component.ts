import { Component, OnInit } from '@angular/core';
import { ChatbotService, Topic } from '../../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import 'flowbite';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  Subscription,
  combineLatest,
  switchMap,
  take,
} from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent implements OnInit {
  chatbotHistory$ = new BehaviorSubject<any>(null);
  chatbotRooms: any[] = [];
  roomId$: BehaviorSubject<string> = new BehaviorSubject('');
  messages: any[] = [];

  topics: Topic[] = [];
  selectedTopic: string = '';

  question: string = '';

  newChatModal: boolean = false;
  newChatTitle: string = '';
  newChatTopic: string = '';

  // new chat validatior
  newChatTitleRequired: boolean = false;
  newChatTopicRequired: boolean = false;

  toggleNewChat(): void {
    this.newChatModal = !this.newChatModal;
    // Reset form fields when modal is closed
    if (!this.newChatModal) {
      this.newChatTitle = '';
      this.newChatTopic = '';
    }
  }

  createChat(): void {
    if (!this.newChatTitle) {
      this.newChatTitleRequired = true;
    } else {
      this.newChatTitleRequired = false;
    }

    if (!this.newChatTopic) {
      this.newChatTopicRequired = true;
    } else {
      this.newChatTopicRequired = false;
    }

    if (this.newChatTitleRequired || this.newChatTopicRequired) {
      return;
    }

    // Implement logic to create new chat here
    console.log('Creating new chat...');
    console.log('Title:', this.newChatTitle);
    console.log('Topic:', this.newChatTopic);
    this.chatbotHistory$.subscribe((history) => {
      if (history) {
        this.chatbotService.createChatbotRooms(
          history.id,
          this.newChatTitle,
          this.newChatTopic
        );
      }
    });

    // Close the modal after creating chat
    this.toggleNewChat();
  }

  private subscriptions: Subscription[] = [];

  constructor(
    private chatbotService: ChatbotService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    initFlowbite(); //Flowbite initiation

    this.loadTopicList();
    this.loadChatbotHistory();

    this.route.paramMap.subscribe((params) => {
      this.roomId$.next(params.get('id') || '');
    });

    combineLatest([this.chatbotHistory$, this.roomId$])
      .pipe(
        switchMap(([chatbotHistory, roomId]) => {
          if (chatbotHistory && roomId) {
            return this.loadChatbotRoom(chatbotHistory.id, roomId);
          }
          return [];
        })
      )
      .subscribe();
  }

  private loadTopicList(): void {
    this.chatbotService.getTopics().subscribe((data: Topic[]) => {
      this.topics = data;
    });
  }

  private loadChatbotHistory(): void {
    this.chatbotService.getChatbotHistory().subscribe((data: any) => {
      this.chatbotHistory$.next(data[0]);
      if (data[0]) {
        this.loadChatbotRooms(data[0].id);
      }
    });
  }

  private loadChatbotRooms(historyId: string): void {
    this.chatbotService.getChatbotRooms(historyId).subscribe((data: any) => {
      this.chatbotRooms = data.map((room: any) => ({
        id: room.id,
        title: room.title,
        topic: room.topic,
      }));
      // console.log(this.chatbotRooms)
    });
  }

  preprocessText(text: string): string {
    // Ganti bintang dengan bullet point
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // ganti bold
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>'); // ganti italic
    text = text.replace(/## (.*?)/g, '</p><h2>$1</h2><p>'); // ganti heading
    text = text.replace(/^\* (.*?)(?=(\*|$))/gm, '<li>$1</li>'); // ganti bullet point
  
    // Ganti poin dan sub-poin
    text = text.replace(/(^\*{2} (.*?)$)/gm, '<ul><li><strong>$2</strong></li>'); // ganti poin
    text = text.replace(/(\*{2} (.*?)$)/gm, '</ul><ul><li><strong>$2</strong></li>'); // ganti sub-poin
  
    // Tag p untuk paragraf
    text = '<p>' + text + '</p>';
  
    return text;
  }
  
  
  

  private loadChatbotRoom(historyId: string, roomId: string): any {
    this.chatbotService
      .initiateModel(historyId, roomId)
      .subscribe((data: any) => {
        data.subscribe((d: any) => {
          console.log(d);
        });
      });
    return this.chatbotService.getChatbotMessage(historyId, roomId).pipe(
      switchMap((data: any) => {
        this.messages = data
          .map((message: any) => ({
            id: message.id,
            content: message.content,
            timestamp: message.created ? message.created.toDate() : null,
            response: message.response ? this.preprocessText(message.response) : null,
          }))
          .sort((a: any, b: any) => a.timestamp - b.timestamp);
        return [];
      })
    );
  }

  sendQuestion(form: NgForm): void {
    const sub = combineLatest([this.chatbotHistory$, this.roomId$])
      .pipe(take(1))
      .subscribe(([chatbotHistory, roomId]) => {
        if (chatbotHistory && roomId) {
          if (form.valid) {
            const formData = {
              question: this.question,
            };
            this.chatbotService
              .sendQuestion(formData, chatbotHistory.id, roomId, this.question)
              .then((docRef: any) => {
                console.log('Document written with ID: ', docRef.id);
              })
              .catch((error: any) => {
                console.error('Error sending question:', error);
                // Handle error
              });
            this.question = '';
          }
        }
      });
    this.subscriptions.push(sub);
  }
}

// Rancangan
// 1. Manajemen history chat (tampilkan chat lama, buat chat baru, pilih topik chat, hapus chat)
// 2. kirim data question ke server python
// 3. tampilkan data response dari server python
