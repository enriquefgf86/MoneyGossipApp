import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/LoginService.service';
import { LogOutService } from 'src/app/services/LogOutService.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userAuthState: boolean;

  constructor(
    private userState: LoginService,
    private logOutService: LogOutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userState.getUserState().subscribe(auth=>{
      if (auth){
        this.userAuthState=true;
      }
      else{
        this.userAuthState=false
      }
      console.log(this.userAuthState);
    })


  }

  // getState() {
  //   if (this.userState.getUserState()) {
  //     this.userAuthState = true;
  //     console.log(this.userAuthState);
  //   } else return (this.userAuthState = false);
  // }
  logOut() {
    this.logOutService.getUserOut();
    this.userAuthState = false;
    // this.router.navigate(['/login']);
  }
}
