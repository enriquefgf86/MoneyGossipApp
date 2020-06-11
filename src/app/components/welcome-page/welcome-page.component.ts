import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/AuthService.service';
import { LoginService } from 'src/app/services/LoginService.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {
allData:any=null;
userAuthId:any;
nameUser:any;
  constructor(private idUser:AuthService,private loginService:LoginService) { }

  ngOnInit(): void {
    this.allData=this.idUser.getUserAuthData;
    this.userAuthId=this.idUser.getUserAuthId;
    (this.nameUser = this.loginService.userdata),
    console.log(this.allData);
    console.log(this.userAuthId);
    console.log(this.idUser.data);

    console.log(this.nameUser);



  }

}
