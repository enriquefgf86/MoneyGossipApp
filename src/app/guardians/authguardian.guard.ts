import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../services/LoginService.service';

@Injectable()
export class authguardian implements CanActivate{



  constructor(private router:Router,private auth:AngularFireAuth,private loginservice:LoginService){}

  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean>{
       return this.auth.authState.pipe(map(authUser=>{
      if(!authUser){
        this.router.navigate(['welcome'])
        return false
      }
      else {
        return true
      }
    }))
  }
}
