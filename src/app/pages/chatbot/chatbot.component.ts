import { Component, OnInit } from '@angular/core';
import { ChatbotService, Topic } from '../../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import 'flowbite';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription, combineLatest, switchMap, take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  toggleNewChat(): void {
    this.newChatModal = !this.newChatModal;
    // Reset form fields when modal is closed
    if (!this.newChatModal) {
      this.newChatTitle = '';
      this.newChatTopic = '';
    }
  }

  createChat(): void {
    // Implement logic to create new chat here
    console.log('Creating new chat...');
    // Close the modal after creating chat
    this.toggleNewChat();
  }

  private subscriptions: Subscription[] = [];

  constructor(
    private chatbotService: ChatbotService,
    private route: ActivatedRoute,
    private http: HttpClient) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.loadTopicList();
    this.loadChatbotHistory();

    this.route.paramMap.subscribe((params) => {
      this.roomId$.next(params.get('id') || '');
    });

    combineLatest([this.chatbotHistory$, this.roomId$]).pipe(
      switchMap(([chatbotHistory, roomId]) => {
        if (chatbotHistory && roomId) {
          return this.loadChatbotRoom(chatbotHistory.id, roomId);
        }
        return [];
      })
    ).subscribe();

    console.log(this.chatbotRooms);
    
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
      }));
    });
  }

  private loadChatbotRoom(historyId: string, roomId: string): any {
    return this.chatbotService.getChatbotMessage(historyId, roomId).pipe(
      switchMap((data: any) => {
        this.messages = data.map((message: any) => ({
          id: message.id,
          content: message.content,
          timestamp: message.created ? message.created.toDate() : null,
          response: message.response,
        })).sort((a: any, b: any) => a.timestamp - b.timestamp);
        return [];
      })
    );
  }

  sendQuestion(form: NgForm): void {
    const sub = combineLatest([this.chatbotHistory$, this.roomId$]).pipe(
      take(1)
    ).subscribe(([chatbotHistory, roomId]) => {
      if (chatbotHistory && roomId) {
        if (form.valid) {
          const formData = {
            question: this.question,
          };
          this.chatbotService.sendQuestion(formData, chatbotHistory.id, roomId, this.question).then((docRef: any) => {
            console.log('Document written with ID: ', docRef.id);
          }).catch((error: any) => {
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
