import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'lawpedia-sc';

  // Navbar
  navLinks: Array<any> = [
    {
      label: 'Beranda',
      href: '/home',
    },
    {
      label: 'Tentang',
      href: '/home',
    },
    {
      label: 'Layanan',
      href: '/home',
      childLinks: [
        {
          name: 'Artikel',
          href: '/articles',
        },
        {
          name: 'Hoax Threads',
          href: '/home',
        },
        {
          name: 'SpeakUp Threads',
          href: '/home',
        },
        {
          name: 'Chatbot',
          href: '/home',
        },
      ],
    },
    {
      label: 'Kontak Kami',
      href: '/home',
    },
  ];

  // Footer
  contactData: Array<any> = [
    {
      icon: '/assets/email-logo.png',
      value: 'lawhub@gmail.com',
    },
    {
      icon: '/assets/phone-logo.png',
      value: '+62-881-2678-1990',
    },
  ];

  socialMediaData: Array<any> = [
    {
      icon: '/assets/instagram-icon.png',
      value: 'lawhub_id',
    },
    {
      icon: '/assets/facebook-icon.png',
      value: 'lawhub_id',
    },
  ];

  ngOnInit(): void {
    initFlowbite();
  }
}
