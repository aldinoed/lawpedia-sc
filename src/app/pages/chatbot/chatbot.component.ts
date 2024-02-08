import { Component, OnInit } from '@angular/core';
import { ChatbotService, Topic } from '../../services/chatbot.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit {
    chatHistory: string[] = [];
    
    topics: Topic[] = [];
    selectedTopic: string = '';

    constructor(private chatbotService: ChatbotService) { }
  
    ngOnInit(): void {
      this.chatbotService.getChatHistory().subscribe((data: any) => {
        this.chatHistory = data;
      });
      this.chatbotService.getTopics().subscribe((data: any) => {
        this.topics = data.map((topic: Topic) => ({
          id: topic.id,
          name: topic.name,
        }));
        this.topics.unshift({ id: 1, name: 'Topik Umum' });
      });
    }
}


// Rancangan
// 1. Manajemen history chat (tampilkan chat lama, buat chat baru, pilih topik chat, hapus chat)
// 2. kirim data question ke server python
// 3. tampilkan data response dari server python

