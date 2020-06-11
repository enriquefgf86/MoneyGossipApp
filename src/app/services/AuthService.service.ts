import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoginService } from './LoginService.service';

@Injectable()
export class AuthService {
  userAuthState: any;
  userData: any;
  data: any;
  storageLoc: any;

  constructor(
    private fireAuth: AngularFireAuth,
    private imageLogo: AngularFireStorage,
    private loginService: LoginService,
    
  ) {
    this.fireAuth.authState.pipe(
      map((auth) => {
        this.userAuthState = auth;
      })
    );

    this.fireAuth.currentUser;
    this.storageLoc = this.imageLogo
      .ref(this.loginService.userdata.restData.email)
      .getDownloadURL()
      .pipe(
        map((element) => {
          return element;
        })
      );
  }
  initier() {
    this.fireAuth.authState.subscribe((auth) => {
      this.data = auth;
    });
    console.log(this.data);
  }

  get getUserAuth(): boolean {
    return this.userAuthState != null;
  }
  getuserAuthenthicated(){
    return this.fireAuth.currentUser;
  }

  get getUserAuthEmailVerified(): boolean {
    return this.getUserAuth ? this.userAuthState.emailVerified : false;
  }

  get getUserAuthId(): string {
    return this.getUserAuth ? this.userAuthState.uid : null;
  }

  get getUserAuthData(): any {
    if (this.getUserAuth) {
      return (this.userData = [
        {
          id: this.userAuthState.uid,
          displayName: this.userAuthState.displayName,
          email: this.userAuthState.email,
          phoneNumber: this.userAuthState.phoneNumber,
          photoURL: this.userAuthState.photoURL,
        },
      ]);
    } else return [];
  }

}
