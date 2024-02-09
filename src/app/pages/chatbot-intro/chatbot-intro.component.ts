import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import 'flowbite';

@Component({
  selector: 'app-chatbot-intro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chatbot-intro.component.html',
  styleUrl: './chatbot-intro.component.css',
})
export class ChatbotIntroComponent implements OnInit {
  ngOnInit() {
    initFlowbite();
  }
}
