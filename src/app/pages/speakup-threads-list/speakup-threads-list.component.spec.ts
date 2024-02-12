import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakupThreadsListComponent } from './speakup-threads-list.component';

describe('SpeakupThreadsListComponent', () => {
  let component: SpeakupThreadsListComponent;
  let fixture: ComponentFixture<SpeakupThreadsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeakupThreadsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpeakupThreadsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
