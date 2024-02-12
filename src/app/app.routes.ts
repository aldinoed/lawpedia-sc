import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { SendArticleComponent } from './pages/send-article/send-article.component';
import { ArticleSentComponent } from './pages/article-sent/article-sent.component';
import { ArticleQuizComponent } from './pages/article-quiz/article-quiz.component';
import { HoaxThreadsListComponent } from './pages/hoax-threads-list/hoax-threads-list.component';
import { HoaxThreadDetailComponent } from './pages/hoax-thread-detail/hoax-thread-detail.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { ChatbotIntroComponent } from './pages/chatbot-intro/chatbot-intro.component';
import { SpeakupThreadsListComponent } from './pages/speakup-threads-list/speakup-threads-list.component';
import { SpeakupThreadDetailComponent } from './pages/speakup-thread-detail/speakup-thread-detail.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'send-article', component: SendArticleComponent, canActivate: [authGuard]},
    { path: 'article-sent', component: ArticleSentComponent, canActivate: [authGuard]},
    { path: 'articles', component: ArticleListComponent },
    { path: 'articles/:id', component: ArticleDetailComponent },
    { path: 'articles/:id/quiz', component: ArticleQuizComponent, canActivate: [authGuard]},
    { path: 'hoax-threads', component: HoaxThreadsListComponent },
    { path: 'hoax-threads/:id', component: HoaxThreadDetailComponent },
    { path: 'chatbot/:id', component: ChatbotComponent, canActivate: [authGuard]},
    { path: 'chatbot', component: ChatbotComponent, canActivate: [authGuard]},
    { path: 'chatbot-intro', component: ChatbotIntroComponent },
    { path: 'speakup-threads', component: SpeakupThreadsListComponent },
    { path: 'speakup-threads/:id', component: SpeakupThreadDetailComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }