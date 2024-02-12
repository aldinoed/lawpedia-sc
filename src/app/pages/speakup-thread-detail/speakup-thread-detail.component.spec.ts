import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakupThreadDetailComponent } from './speakup-thread-detail.component';

describe('SpeakupThreadDetailComponent', () => {
  let component: SpeakupThreadDetailComponent;
  let fixture: ComponentFixture<SpeakupThreadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeakupThreadDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpeakupThreadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
