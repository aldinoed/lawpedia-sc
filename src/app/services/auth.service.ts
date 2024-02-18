import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.user$ = fireauth.authState;
  }

  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      () => {
        localStorage.setItem('token', 'true');
        this.user$.subscribe((user) => {
          localStorage.setItem('uid', user?.uid);
        });
        Swal.fire({
          title: 'Login Success!',
          text: `Welcome to LawSites, ${email}!`,
          icon: 'success',
        });
        this.router.navigate(['home']);
      },
      (err) => {
        Swal.fire({
          title: 'Login Failed!',
          text: `Something went wrong : ${err}`,
          icon: 'error',
        });
      }
    );
  }

  async googleLogin() {
    try {
      // Sign in with Google
      const result = await this.fireauth.signInWithPopup(
        new GoogleAuthProvider()
      );
      // Check if the user already exists
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', result.user?.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const userRef = doc(this.firestore, 'users/' + result.user?.uid);
        await setDoc(userRef, {
          username: result.user?.displayName,
          email: result.user?.email,
          fullname: '',
        });
      }

      // Set token and navigate to home
      localStorage.setItem('token', 'true');
      this.user$.subscribe((user) => {
        localStorage.setItem('uid', user?.uid);
      });
      Swal.fire({
        title: 'Login Success!',
        text: `Welcome to LawSites!`,
        icon: 'success',
      });
      this.router.navigate(['/home']);
    } catch (err) {
      console.error('Login Failed:', err);
      Swal.fire({
        title: 'Login Failed!',
        text: `Something went wrong : ${err}`,
        icon: 'error',
      });
    }
  }

  async register(username: string, email: string, password: string) {
    try {
      const credentials = await this.fireauth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = credentials.user;

      const userRef = doc(this.firestore, 'users/' + user?.uid);
      await setDoc(userRef, {
        username: username,
        email: email,
        fullname: '',
      });

      Swal.fire({
        title: 'Register Success!',
        text: `You are LawPedia's member now, ${email}!`,
        icon: 'success',
      });

      this.router.navigate(['login']);
    } catch (err) {
      Swal.fire({
        title: 'Register Failed!',
        text: `Something went wrong : ${err}`,
        icon: 'error',
      });
    }
  }

  getUser(uid: string): any {
    if (uid) {
      return getDoc(doc(this.firestore, 'users', uid));
    }
    return null;
  }

  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        this.router.navigate(['login']);
      },
      (err) => {
        Swal.fire({
          title: 'Logout Failed!',
          text: `Something went wrong : ${err}`,
          icon: 'error',
        });
      }
    );
  }

  isLoggedIn() {
    return localStorage.getItem('token') === 'true';
  }
}
