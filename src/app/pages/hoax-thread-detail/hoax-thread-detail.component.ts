import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ArticleService } from '../../services/article.service';
// import { Article } from '../../services/article.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hoax-thread-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hoax-thread-detail.component.html',
  styleUrl: './hoax-thread-detail.component.css',
})
export class HoaxThreadDetailComponent {
  // article: Article | null = null;
  hoax: any | null = {
    id: 1,
    title: 'Ini Judul',
    content: '<p>Ini Content</p><br><br><br><br><br><br><br><p>End of Content</p>',
    category: 'Hukum Internasional',
    views: 100,
    published: new Date(),
  };
  publishedDate: Date = this.hoax?.published;
  hoaxCategory = 'Hukum Internasional';
}
