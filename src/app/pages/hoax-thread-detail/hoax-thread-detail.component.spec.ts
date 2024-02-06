import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoaxThreadDetailComponent } from './hoax-thread-detail.component';

describe('HoaxThreadDetailComponent', () => {
  let component: HoaxThreadDetailComponent;
  let fixture: ComponentFixture<HoaxThreadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoaxThreadDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoaxThreadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
