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
    { path: 'authentication', component: AuthComponent },
    { path: 'lawlibrary/contibute', component: SendArticleComponent, canActivate: [authGuard]},
    { path: 'lawlibrary/contribute/success', component: ArticleSentComponent, canActivate: [authGuard]},
    { path: 'lawlibrary', component: ArticleListComponent },
    { path: 'lawlibrary/:id', component: ArticleDetailComponent },
    { path: 'lawlibrary/:id/quiz', component: ArticleQuizComponent, canActivate: [authGuard]},
    { path: 'lawfact', component: HoaxThreadsListComponent },
    { path: 'lawfact/:id', component: HoaxThreadDetailComponent },
    { path: 'lawbot/c/:id', component: ChatbotComponent, canActivate: [authGuard]},
    { path: 'lawbot/c', component: ChatbotComponent, canActivate: [authGuard]},
    { path: 'lawbot', component: ChatbotIntroComponent },
    { path: 'lawspeak', component: SpeakupThreadsListComponent },
    { path: 'lawspeak/:id', component: SpeakupThreadDetailComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }