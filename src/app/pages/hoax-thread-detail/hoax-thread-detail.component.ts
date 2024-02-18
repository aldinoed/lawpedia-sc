import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ArticleService } from '../../services/article.service';
// import { Article } from '../../services/article.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HoaxService } from '../../services/hoax.service';
import { RouterModule, Router } from '@angular/router';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-hoax-thread-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hoax-thread-detail.component.html',
  styleUrl: './hoax-thread-detail.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HoaxThreadDetailComponent implements OnInit {
  hoax: any = null;
  publishedDate: Date = new Date();
  latestHoaxData: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private hoaxService: HoaxService,
    private router: Router
  ) {}

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
    this.loadLatestHoax();
    
  }

  private loadLatestHoax() {
    this.hoaxService.getHoaxList().subscribe((hoaxes) => {
      this.latestHoaxData = hoaxes
        .map((hoax: any) => ({
          id: hoax.id,
          title: hoax.title,
          content: hoax.content,
          published: hoax.published.toDate(),
          views: hoax.views,
        }))
        .sort((a, b) => b.published.getTime() - a.published.getTime())
        .slice(0, 4);
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

  navigateToHoax(hoaxId: string) {
    // navigasi ke article detail
    this.router.navigate(['/lawfact', hoaxId]).then(() => {
      // Setelah navigasi, refresh halaman
      window.location.reload();
    });
  }
}
