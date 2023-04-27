import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
// export class LoginPage implements OnInit {
export class LoginPage{
  sample22 = 1;

  constructor(private router: Router) { }

  // ngOnInit() {
  // }

  logMeIn(){
    this.router.navigate(['/home']);
  }
}
