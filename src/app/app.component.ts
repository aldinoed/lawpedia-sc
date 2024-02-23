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
      id: 1,
      value: 'lawsites06@gmail.com',
    },
    {
      id: 2,
      value: '+62-882-1883-2453',
    },
  ];

  socialMediaData: Array<any> = [
    {
      icon: '/assets/instagram-icon.png',
      value: 'lawsites_id',
    },
    {
      icon: '/assets/facebook-icon.png',
      value: 'lawsites_id',
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

  // Sidebar Link
  sidebarLinks: Array<any> = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '/assets/dashboard-icon.gif',
    },
    {
      name: 'LawLibrary',
      href: '/dashboard/lawlibrary',
      icon: '/assets/lawlibrary-icon.png',
    },
    {
      name: 'LawFact',
      href: '/dashboard/lawfact',
      icon: '/assets/lawfact-icon.png',
    },
    {
      name: 'LawSpeak',
      href: '/dashboard/lawspeak',
      icon: '/assets/lawspeak-icon.png',
    },
    {
      name: 'LawBot',
      href: '/dashboard/lawbot',
      icon: '/assets/lawbot-icon.png',
    },
  ];

  authenticatedUser = 'Jajang Sutarman'; // Authenticated User

  // PROFILE ICON
  getInitialName(name: string): string {
    if (!name) return '';
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i].charAt(0);
    }

    return initials;
  }
}
