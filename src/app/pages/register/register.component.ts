import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  // standalone: true,
  // imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent{
  email : string = '';
  password : string = '';

  constructor(private auth : AuthService){}

  ngOnInit(): void{}

  register(){
    if(this.email == ''){
      alert("Please enter your email");
      return;
    }
    if(this.password == ''){
      alert("Please enter your password");
      return;
    }

    this.auth.register(this.email, this.password);

    this.email = '';
    this.password = '';
  }
}
