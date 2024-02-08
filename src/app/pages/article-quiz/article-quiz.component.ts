import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { ActivatedRoute } from '@angular/router';
import { collection } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-quiz.component.html',
  styleUrl: './article-quiz.component.css'
})
export class ArticleQuizComponent implements OnInit {
  quizData: Array<any> = [];
  articleId: string = '';
  submitted: boolean = false;
  selectedAnswers: { [key: string]: string } = {};

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get('id') || '';
      this.loadQuiz();      
    });
  }

  private loadQuiz() {
    this.articleService.getArticleQuiz(this.articleId).subscribe((quiz) => {
      this.quizData = quiz.quiz;
      console.log(this.quizData);
    });
  }

  onAnswerChange(questionId: string, answerId: string) {
    // Menyimpan jawaban yang dipilih untuk setiap pertanyaan
    this.selectedAnswers[questionId] = answerId;
  }

  submitQuiz() {
    // Menandai bahwa kuis sudah disubmit
    this.submitted = true;

    // Menghitung skor
    let score = 0;
    this.quizData.forEach(question => {
      if (this.selectedAnswers[question.id] === question.answer) {
        score++;
      }
    });

    // Menampilkan skor
    alert(`Your score: ${100*score/this.quizData.length}`);
  }

}
