import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  selectedAuth: string = 'login';
  email: string = '';
  password: string = '';
  username: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  selectAuth(authType: string): void {
    this.selectedAuth = authType;
  }

  login() {
    if (this.email == '') {
      alert('Please enter your email');
      return;
    }
    if (this.password == '') {
      alert('Please enter your password');
      return;
    }

    this.auth.login(this.email, this.password);

    this.email = '';
    this.password = '';
  }

  register() {
    if (this.username == '') {
      alert('Please enter your username');
      return;
    }
    if (this.email == '') {
      alert('Please enter your email');
      return;
    }
    if (this.password == '') {
      alert('Please enter your password');
      return;
    }

    this.auth.register(this.username, this.email, this.password);

    this.email = '';
    this.password = '';
  }

  googleLogin() {
    this.auth.googleLogin();
  }
}
