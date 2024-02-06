import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotIntroComponent } from './chatbot-intro.component';

describe('ChatbotIntroComponent', () => {
  let component: ChatbotIntroComponent;
  let fixture: ComponentFixture<ChatbotIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotIntroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
