import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  ngOnInit(): void {
    initFlowbite(); //flowbite initiation
  }

  

  // ANALYTIC CARD DATA
  analyticCards: Array<any> = [
    {
      name: 'Jumlah artikel terunggah',
      amount: 755,
    },
    {
      name: 'Jumlah hoaks threads terunggah',
      amount: 755,
    },
    {
      name: 'Jumlah Speakup threads terunggah',
      amount: 755,
    },
    {
      name: 'Jumlah Sumber Literasi terunggah',
      amount: 755,
    },
  ];
}
