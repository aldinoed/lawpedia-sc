import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit {
    chatHistory: string[] = [];
    topic: [] = [];


    constructor(private chatbotService: ChatbotService) { }
  
    ngOnInit(): void {
      this.chatbotService.getChatHistory().subscribe((data: any) => {
        this.chatHistory = data;
      });
      this.chatbotService.getTopic().subscribe((data: any) => {
        this.topic = data;
      });
    }
}


// Rancangan
// 1. Manajemen history chat (tampilkan chat lama, buat chat baru, pilih topik chat, hapus chat)
// 2. kirim data question ke server python
// 3. tampilkan data response dari server python

