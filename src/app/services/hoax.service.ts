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
  deleteDoc,
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

  addHoax(data: any): any {
    const file = data.file;
    delete data.file;
    addDoc(collection(this.firestore, 'hoaxList'), data)
      .then(async (docRef) => {
        const filePath = `content/media/${docRef.id}/index`; // Using file.name to get the file name
        const fileRef = ref(this.storage, filePath);
  
        try {
          const snapshot = await uploadBytes(fileRef, file);
          console.log('Uploaded a blob or file!', snapshot);
        } catch (error) {
          console.error('Error uploading file', error);
        }
      })
      .catch((error) => {
        console.error('Error adding document:', error);
      });
  }
  

  updateHoax(data: any, id: string): Promise<any> {
    return setDoc(doc(this.firestore, 'hoaxList', id), data);
  }

  deleteHoax(id: string): Promise<any> {
    return deleteDoc(doc(this.firestore, 'hoaxList', id));
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