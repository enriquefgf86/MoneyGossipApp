import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoginData } from './LoginService.service';

@Injectable()
export class SignFormService {

  constructor(private formBuilder: FormBuilder) {}


  buildLogin() {
    return this.formBuilder.group({
      emailUser: this.formBuilder.control(""),
      passwordUser: this.formBuilder.control("")
    });
  }

  getDataLoginBuilt(ngForm) {
    return {
      emailUser: ngForm.value.emailUser,
      passwordUser: ngForm.value.passwordUser
    } as LoginData;
  }
}
