import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ArticleService } from '../../services/article.service';
// import { Article } from '../../services/article.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HoaxService } from '../../services/hoax.service';

@Component({
  selector: 'app-hoax-thread-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hoax-thread-detail.component.html',
  styleUrl: './hoax-thread-detail.component.css',
})
export class HoaxThreadDetailComponent implements OnInit {
  hoax: any = null;
  publishedDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private hoaxService: HoaxService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.hoaxService.getHoax(id ? id : '').subscribe((hoax) => {
      this.hoax = hoax;
      this.publishedDate = hoax.published.toDate();
      this.hoaxService.getContentImages(hoax.id).subscribe((images) => {
        this.hoax.images = images;
      });
      this.route.url.subscribe((segments) => {
        this.hoax.url = segments.map((segment) => segment.path).join('/');
      });
    });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        title: 'Link copied!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    });
  }
}
