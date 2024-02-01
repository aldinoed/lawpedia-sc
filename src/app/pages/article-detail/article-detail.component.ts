import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.css'
})
export class ArticleDetailComponent implements OnInit {
  article: any;

  constructor(private route: ActivatedRoute, private articleService: ArticleService) {}

  ngOnInit() {
    
  }

}
