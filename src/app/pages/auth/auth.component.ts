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
  confirmPassword: string = '';

  // login validation
  emailRequired: boolean = false;
  // emailInvalid: boolean = false;
  passwordRequired: boolean = false;

  // register validation
  registerEmailRequired: boolean = false;
  registerPasswordRequired: boolean = false;
  registerConfirmPasswordRequired: boolean = false;
  registerConfirmPasswordMatch: boolean = false;
  registerUsernameRequired: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  selectAuth(authType: string): void {
    this.selectedAuth = authType;
  }

  login() {
    if (this.email == '') {
      this.emailRequired = true;
    } else {
      this.emailRequired = false;
    }

    if (this.password == '') {
      this.passwordRequired = true;
    } else {
      this.passwordRequired = false;
    }

    if (this.emailRequired || this.passwordRequired) {
      return;
    }

    this.emailRequired = false;
    this.passwordRequired = false;

    this.auth.login(this.email, this.password);

    this.email = '';
    this.password = '';
  }

  register() {
    if (this.username == '') {
      this.registerUsernameRequired = true;
    } else {
      this.registerUsernameRequired = false;
    }
    if (this.email == '') {
      this.registerEmailRequired = true;
    } else {
      this.registerEmailRequired = false;
    }
    if (this.password == '') {
      this.registerPasswordRequired = true;
    } else {
      this.registerPasswordRequired = false;
    }
    if (this.confirmPassword == '' || this.confirmPassword == null) {
      this.registerConfirmPasswordRequired = true;
    } else {
      this.registerConfirmPasswordRequired = false;
    }
    if (this.confirmPassword != '' && this.confirmPassword != this.password) {
      this.registerConfirmPasswordMatch = true;
    } else {
      this.registerConfirmPasswordMatch = false;
    }

    if (
      this.registerUsernameRequired ||
      this.registerEmailRequired ||
      this.registerPasswordRequired ||
      this.registerConfirmPasswordRequired ||
      this.registerConfirmPasswordMatch
    ) {
      return;
    }

    this.registerUsernameRequired = false;
    this.registerEmailRequired = false;
    this.registerPasswordRequired = false;
    this.registerConfirmPasswordRequired = false;
    this.registerConfirmPasswordMatch = false;

    this.auth.register(this.username, this.email, this.password);

    this.email = '';
    this.password = '';
    this.username = '';
    this.confirmPassword = '';
  }

  googleLogin() {
    this.auth.googleLogin();
  }
}
