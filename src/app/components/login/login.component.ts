import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/LoginService.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/AuthService.service';
import { FormGroup } from '@angular/forms';
import { SignFormService } from 'src/app/services/SignInFormService.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  nameUser: string;
  emailUser: string;
  passwordUser: string;
  userLogState: any = null;
  userId: any;

  ngForm: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private iduser: AuthService,
    private signInService: SignFormService
  ) {
    this.ngForm = this.signInService.buildLogin();
  }
  ngOnInit(): void {}

  logIn() {
    this.loginService
      .logInUser(this.signInService.getDataLoginBuilt(this.ngForm))
      .then(() => {
        (this.nameUser = this.loginService.userauth.userEmail),
          this.router.navigate([
            'user/' + this.loginService.userdata.restData.uid,
          ]);
      });
  }

  closeSign(){
  return this.router.navigate(['welcome'])
  }
}
