import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  getDoc,
  doc,
  setDoc,
  addDoc,
} from '@angular/fire/firestore';
import { OperatorFunction, Observable, of, forkJoin } from 'rxjs';
import { switchMap, map, toArray, take } from 'rxjs/operators';
import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';
import { from, combineLatest } from 'rxjs';
import { query, where } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private firestore: Firestore = inject(Firestore);
  private auth: AuthService = inject(AuthService);

  constructor() {
    
  }

  
}
