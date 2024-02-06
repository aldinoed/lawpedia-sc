import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot-intro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chatbot-intro.component.html',
  styleUrl: './chatbot-intro.component.css',
})
export class ChatbotIntroComponent {}
