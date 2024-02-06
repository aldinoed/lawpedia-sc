import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ArticleListComponent } from './pages/article-list/article-list.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { SendArticleComponent } from './pages/send-article/send-article.component';
import { ArticleSentComponent } from './pages/article-sent/article-sent.component';
import { HoaxThreadsListComponent } from './pages/hoax-threads-list/hoax-threads-list.component';
import { HoaxThreadDetailComponent } from './pages/hoax-thread-detail/hoax-thread-detail.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { ChatbotIntroComponent } from './pages/chatbot-intro/chatbot-intro.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'send-article', component: SendArticleComponent },
    { path: 'article-sent', component: ArticleSentComponent },
    { path: 'articles', component: ArticleListComponent },
    { path: 'articles/:id', component: ArticleDetailComponent },
    { path: 'hoax-threads', component: HoaxThreadsListComponent },
    { path: 'hoax-threads/:id', component: HoaxThreadDetailComponent },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'chatbot-intro', component: ChatbotIntroComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }

  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }