import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { LoginService } from './LoginService.service';
import { Router } from '@angular/router';
@Injectable()
export class LogOutService{
  constructor(private logOut:AngularFireAuth,private loginService:LoginService,private router:Router){}

  getUserOut(){
    this.logOut.signOut();
    this.loginService.authStateUser=false;
    this.router.navigate(['login'])
  }
}
