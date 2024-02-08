import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleQuizComponent } from './article-quiz.component';

describe('ArticleQuizComponent', () => {
  let component: ArticleQuizComponent;
  let fixture: ComponentFixture<ArticleQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleQuizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
