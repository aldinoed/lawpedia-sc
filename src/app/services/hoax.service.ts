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
} from '@angular/fire/firestore'
import { 
  Storage, 
  getDownloadURL, 
  ref, 
  listAll,
  uploadBytes,
  uploadBytesResumable,
  uploadString, 
} from '@angular/fire/storage';
import { Observable, combineLatest, map } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HoaxService {
  private firestore: Firestore = inject(Firestore)
  private storage: Storage = inject(Storage)
  hoaxList: Observable<any[]>

  constructor() {
    this.hoaxList = collectionData(collection(this.firestore, 'hoaxList'), {
      idField: 'id',
    }) as Observable<any[]>;
  }

  getHoaxList(): Observable<any[]> {
    return this.hoaxList;
  }

  getHoax(id: string): Observable<any> {
    this.updateHoaxViews(id);
    return this.hoaxList.pipe(
      map((hoaxes: Hoax[]) => 
        hoaxes.find((hoax) => hoax.id === id))
    );
  }

  getContentImages(id: string): Observable<string[]> {
    try {
      const imageRefs = listAll(ref(this.storage, `content/media/${id}`));
      return from(imageRefs).pipe(
        map((imageList) => {
          const urls: string[] = [];
          imageList.items.forEach((imageRef) => {
            getDownloadURL(imageRef).then((url) => {
              urls.push(url);
            });
          });
          return urls;
        })
      );
    } catch (error) {
      console.error(error);
      return new Observable<string[]>();
    }
  }

  updateHoaxViews(id: string): void {
    const hoaxRef = doc(this.firestore, 'hoaxList', id);
    getDoc(hoaxRef).then((doc) => {
      if (doc.exists()) {
        const hoax = doc.data() as Hoax;
        setDoc(hoaxRef, { views: hoax.views + 1 }, { merge: true });
      }
    });
  }

  addHoax(data: any): Promise<any> {
    return addDoc(collection(this.firestore, 'hoaxList'), data);
  }

  updateHoax(data: any, id: string): Promise<any> {
    return setDoc(doc(this.firestore, 'hoaxList', id), data);
  }

  addHoaxImage(id: string, file: File): Promise<any> {
    return uploadBytes(ref(this.storage, `content/media/${id}/${file.name}`), file);
  }

}

export interface Hoax {
  id: string;
  title: string;
  content: string;
  images: string;
  published: Date;
  views: number;
}