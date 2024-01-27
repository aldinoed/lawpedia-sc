import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router : Router) { }

  login(email: string, password: string){
    this.fireauth.signInWithEmailAndPassword(email,password).then(()=>{
      localStorage.setItem('token', 'true');
      Swal.fire({
        title : "Login Success!",
        text : `Welcome to LawPedia, ${email}!`
      })
      this.router.navigate(['home']);
    }, err =>{
      Swal.fire({
        title : "Login Failed!",
        text : `Something went wrong : ${err}`,
        icon : "error"
      })
    })
  }
  register(email: string, password: string){
    this.fireauth.createUserWithEmailAndPassword(email,password).then(()=>{
      Swal.fire({
        title : "Register Success!",
        text : `You are LawPedia's member now, ${email}!`,
        icon : "success"
      })
      this.router.navigate(['login']);
    }, err =>{
      Swal.fire({
        title : "Register Failed!",
        text : `Something went wrong : ${err}`,
        icon : "error"
      })
    })
  }

  logout(){
    this.fireauth.signOut().then(()=>{
      localStorage.removeItem('token');
      this.router.navigate(['login'])
    }, err =>{
      Swal.fire({
        title : "Logout Failed!",
        text : `Something went wrong : ${err}`,
        icon : "error"
      })
    })
  }
}
