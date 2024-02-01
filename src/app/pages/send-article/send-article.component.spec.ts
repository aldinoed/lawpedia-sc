import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendArticleComponent } from './send-article.component';

describe('SendArticleComponent', () => {
  let component: SendArticleComponent;
  let fixture: ComponentFixture<SendArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendArticleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
