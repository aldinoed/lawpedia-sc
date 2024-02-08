import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ArticleService } from '../../services/article.service';
// import { Article } from '../../services/article.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HoaxService } from '../../services/hoax.service';
import { RouterModule } from '@angular/router';
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
// export class HoaxThreadDetailComponent {
//   // article: Article | null = null;
//   hoax: any | null = {
//     id: 1,
//     title: 'Vaksin Covid-19 Dapat Menyebabkan Kerusakan Otak Jangka Panjang',
//     content:
//       '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
//     category: 'Hukum Internasional',
//     views: 100,
//     published: new Date(),
//   };
//   publishedDate: Date = this.hoax?.published;
//   hoaxCategory = 'Hukum Internasional';
//   carouselImages: Array<string> = [
//     'https://source.unsplash.com/700x500',
//     'https://source.unsplash.com/700x500',
//     'https://source.unsplash.com/700x500',
//   ];

//   latesHoaxData: Array<any> = [
//     {
//       id: 1,
//       title: 'Vaksin Covid-19 Dapat Menyebabkan Kerusakan Otak Jangka Panjang',
//       content:
//         '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
//       category: 'Hukum Internasional',
//       views: 100,
//       published: new Date(),
//     },
//     {
//       id: 2,
//       title: 'Vaksin Covid-19 Dapat Menyebabkan Kerusakan Otak Jangka Panjang',
//       content:
//         '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
//       category: 'Hukum Internasional',
//       views: 100,
//       published: new Date(),
//     },
//     {
//       id: 2,
//       title: 'Vaksin Covid-19 Dapat Menyebabkan Kerusakan Otak Jangka Panjang',
//       content:
//         '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
//       category: 'Hukum Internasional',
//       views: 100,
//       published: new Date(),
//     },
//     {
//       id: 2,
//       title: 'Vaksin Covid-19 Dapat Menyebabkan Kerusakan Otak Jangka Panjang',
//       content:
//         '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
//       category: 'Hukum Internasional',
//       views: 100,
//       published: new Date(),
//     },
//   ];
// }

export class HoaxThreadDetailComponent implements OnInit {
  hoax: any = null;
  publishedDate: Date = new Date();
  latestHoaxData: Array<any> = [];

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
    this.loadLatestHoax();
  }

  private loadLatestHoax() {
    this.hoaxService.getHoaxList().subscribe((hoaxes) => {
      this.latestHoaxData = hoaxes.map((hoax: any) => ({
        id: hoax.id,
        title: hoax.title,
        content: hoax.content,
        published: hoax.published.toDate(),
        views: hoax.views,
      })).sort((a, b) => b.published.getTime() - a.published.getTime()).slice(0, 4);
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
