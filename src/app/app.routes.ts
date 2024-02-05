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
import { ChatbotComponent } from './pages/chatbot/chatbot.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'send-article', component: SendArticleComponent },
    { path: 'article-sent', component: ArticleSentComponent },
    { path: 'articles', component: ArticleListComponent },
    { path: 'articles/:id', component: ArticleDetailComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'chatbot', component: ChatbotComponent}

  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }