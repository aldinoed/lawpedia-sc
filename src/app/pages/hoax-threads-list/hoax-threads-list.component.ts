import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hoax-threads-list',
  standalone: true,
  imports: [RouterModule, NgxPaginationModule, CommonModule],
  templateUrl: './hoax-threads-list.component.html',
  styleUrl: './hoax-threads-list.component.css',
})
export class HoaxThreadsListComponent {
  // PAGINATION
  p: number = 1;
  collection: Array<any> = [
    {
      id: 1,
      title: 'Ini Judul',
      content: '<p>Ini Content</p>',
      category: 'Hukum Internasional',
      views: 100,
      published: new Date(),
    },
  ];
}
