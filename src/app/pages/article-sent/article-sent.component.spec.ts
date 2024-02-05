import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSentComponent } from './article-sent.component';

describe('ArticleSentComponent', () => {
  let component: ArticleSentComponent;
  let fixture: ComponentFixture<ArticleSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleSentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
