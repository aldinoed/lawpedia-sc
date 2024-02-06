import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoaxThreadsListComponent } from './hoax-threads-list.component';

describe('HoaxThreadsListComponent', () => {
  let component: HoaxThreadsListComponent;
  let fixture: ComponentFixture<HoaxThreadsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoaxThreadsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoaxThreadsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
