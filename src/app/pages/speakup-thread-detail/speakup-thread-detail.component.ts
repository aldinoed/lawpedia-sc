import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-speakup-thread-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './speakup-thread-detail.component.html',
  styleUrl: './speakup-thread-detail.component.css',
})
export class SpeakupThreadDetailComponent {
  getInitialName(name: string): string {
    const words = name.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(words.length, 2); i++) {
      initials += words[i].charAt(0);
    }

    return initials;
  }

  speakup = {
    id: 1,
    user: 'John Doe',
    content:
      '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</p><br><p><b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione cumque culpa quas blanditiis.</b></p>',
    comments: [
      {
        id: 10,
        user: 'Michael Jordan',
        content:
          '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione.</p><br><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti.</p>',
        created_at: new Date(),
      },
      {
        id: 11,
        user: 'Michael Jordan',
        content:
          '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione.</p><br><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti.</p>',
        created_at: new Date(),
      },
      {
        id: 12,
        user: 'Michael Jordan',
        content:
          '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione.</p><br><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti.</p>',
        created_at: new Date(),
      },
    ],
    views: 100,
    updates: [
      {
        id: 101,
        content:
          '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione.</p><br><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti <i>totam sit natus laudantium</i> corrupti.</p>',
        created_at: new Date(),
      },
      {
        id: 102,
        content:
          '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti totam sit natus laudantium corrupti ratione.</p><br><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo deleniti <i>totam sit natus laudantium</i> corrupti.</p>',
        created_at: new Date(),
      },
    ],
    created_at: new Date(),
  };

  // CATEGORY LIST
  categories: Array<any> = [
    {
      name: 'Kategori 1',
      followers: 100,
    },
    {
      name: 'Kategori 2',
      followers: 200,
    },
    {
      name: 'Kategori 3',
      followers: 150,
    },
    {
      name: 'Kategori 4',
      followers: 60,
    },
  ];
}
