import { Component, OnInit, OnDestroy } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  Event as NavigationEvent,
} from '@angular/router';
import { AuthService } from './services/auth.service';
import { authGuard } from './services/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'LawSites';

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

  currentPath: string = '';

  event$;

  constructor(
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.event$ = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        // console.log(event.url, 'event url');
        this.currentPath = event.url;
      }
    });
  }

  ngOnInit(): void {
    initFlowbite();
  }

  ngOnDestroy() {
    this.event$.unsubscribe();
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/authentication']);
  }
}
