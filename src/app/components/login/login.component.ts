import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  password: any;
  invalIdLogin: boolean = false;
  @Output() loginEvent = new EventEmitter<boolean>();


  login() {
    if (this.password === "admin") {
      this.invalIdLogin = false;
      this.loginEvent.emit(true);
    } else {
      this.invalIdLogin = true;
    }
  }

}
