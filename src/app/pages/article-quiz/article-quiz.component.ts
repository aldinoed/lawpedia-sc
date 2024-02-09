import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { collection } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-article-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-quiz.component.html',
  styleUrl: './article-quiz.component.css',
})
export class ArticleQuizComponent implements OnInit {
  quizData: Array<any> = [];
  articleId: string = '';
  submitted: boolean = false;
  selectedAnswers: { [key: string]: string } = {};
  quizHistory: any;
  quizHistoryData: any;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.articleId = params.get('id') || '';
      this.loadQuiz();
      // this.getHistory();
    });
    
  }

  private loadQuiz(): void {
    this.articleService.getArticleQuiz(this.articleId).subscribe(quiz => {
      this.quizData = quiz;

      this.articleService.getQuizHistory(this.articleId).subscribe((history) => {
        this.quizHistory = history[0];
        if (this.quizHistory) {
          this.articleService.getQuizHistoryDetail(this.articleId, this.quizHistory.id).subscribe((data) => {
            this.quizHistoryData = data.map((item: any) => {
              return {
                ...item,
                question: item.question.path.split('/').pop(),
              };
            });
            if (this.quizHistoryData) {
              this.quizData.forEach(question => {
                const historyItem = this.quizHistoryData.find((item: any) => item.question === question.id);
                if (historyItem) {
                  question.userAnswer = historyItem.userAnswer;
                }
              });
            }
          });
        }
      });
    });
  }

  onAnswerChange(questionId: string, answerId: string) {
    // Menyimpan jawaban yang dipilih untuk setiap pertanyaan
    this.selectedAnswers[questionId] = answerId;
  }

  // private getHistory() {
  //   this.articleService.getQuizHistory(this.articleId).subscribe((history) => {
  //     this.quizHistory = history[0];
  //     if (this.quizHistory) {
  //       this.articleService.getQuizHistoryDetail(this.articleId, this.quizHistory.id).subscribe((data) => {
  //         this.quizHistoryData = data.map((item: any) => {
  //           return {
  //             ...item,
  //             question: item.question.path.split('/').pop(),
  //           };
  //         });
  //       });
  //     }
  //   });
  // }


  submitQuiz() {
    // Menandai bahwa kuis sudah disubmit
    this.submitted = true;

    // Menghitung skor
    let score = 0;
    this.quizData.forEach((question) => {
      if (this.selectedAnswers[question.id] === question.answer) {
        score++;
      }
    });
    score /= this.quizData.length * 100;

    // Menyimpan skor dan jawaban user ke database
    this.articleService.saveQuizResult(this.articleId, score, this.selectedAnswers);

    // Menampilkan skor
    Swal.fire({
      title: `Your score: ${score}`,
      text: "Berhasil mengerjakan kuis!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      cancelButtonText: 'Kembali',
    }).then((result) => {
      if (!result.isConfirmed) {
        this.router.navigate(['/articles', this.articleId]);
      }
    });
  }
}
