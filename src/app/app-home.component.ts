import { Route } from "@angular/compiler/src/core";
import { Component } from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    template: `<div class="container">
    <div class="row" style="margin-top: 20vh;">
      <div class="col m6">
        <img src="/assets/images/homepage.svg" alt="" class="responsive-img">
      </div>
      <div class="col m4 offset-m1">
        <h5 style="text-align: justify; line-height: 40px;">That is you. You are still in the homepage. Why don't you checkout what we do and get started instead.</h5>
        <div class="center-align" style="margin-top: 25px;">
          <button class="deep-orange text-white waves-effect waves-light btn">Walk me through</button><br><br>
          <button class="deep-orange text-white waves-effect waves-light btn" (click)="login()">Login</button>
        </div>
      </div>
    </div>
  </div>`,
})
export class AppHomeComponent {

    constructor(private router:Router){
    }

    login(){
        this.router.navigate(['/dashboard']);
    }
}