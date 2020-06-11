import { Component, OnInit } from '@angular/core';
import { signUpForm } from 'src/app/models/signUpModel.model';
import {
  LoginService,
  SignUpData,
} from 'src/app/services/LoginService.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { async } from 'rxjs/internal/scheduler/async';
// import { ValidationService } from 'src/app/services/ValidationService.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  defaultImage: string = '/assets/imgs/defaultUser.png';
  imgSelected: any;

  ngForm: FormGroup;

  formSignup: signUpForm = {
    nameUser: '',
    emailUser: '',
    passwordUser: '',
    confirmPasswordUser: '',
    imageUser: '',
  };

  constructor(
    private signUserUp: LoginService,
    private router: Router,
    private imgUploader: AngularFireStorage,
    private createDoc: AngularFirestore,
    private UserAuth: AngularFireAuth,
    private formBuilder: FormBuilder
  ) {
    this.ngForm = this.formBuilder.group({
      nameUser: new FormControl('', Validators.compose([Validators.required])),

      emailUser: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ])
      ),
      //    [this.formBuilder.control(''),
      //   [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]
      // ],
      passwordUser: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      // [ this.formBuilder.control(''), [Validators.required]],

      imageUser: new FormControl(''),
      //  this.formBuilder.control(''),
    });
  }

  ngOnInit(): void {}

  async selectImg(event: any) {
    if (event.target.files && event.target.files[0]) {
      const imageReader = await new FileReader();
      imageReader.onload = async (imgCharger: any) =>
        (this.defaultImage = await imgCharger.target.result);
      await imageReader.readAsDataURL(event.target.files[0]);
      this.imgSelected = await event.target.files[0];
      console.log(this.imgSelected);
    } else {
      this.defaultImage = await '/assets/imgs/defaultUser.png';
      this.imgSelected = await null;
    }
  }

  async signUp() {
    this.signUserUp
      .signUpUser(this.ngForm.value as SignUpData)
      .then(async () => {
        this.router.navigate(['user/' + this.signUserUp.userdata.restData.uid]);
        this.createDoc.collection('users').add(this.signUserUp.userdata.uid);
      })
      .catch((error) => error.messages);
    //estableciendo el camino del usuario img en el firestorage
    const storagePath = await `${
      this.ngForm.value.emailUser
    }/${this.imgSelected.name.split('.').splice(0, 1)}`;

    //estableciendo variable que fije la referencia al camino de la imagen del usuario en storage
    const refStorage = await this.imgUploader.ref(storagePath);
    console.log(storagePath);

    await this.imgUploader
      .upload(storagePath, this.imgSelected)
      .snapshotChanges()
      .pipe(
        finalize(() => {
          refStorage.getDownloadURL().subscribe((urlImg) => {
            console.log(urlImg);
            this.ngForm.value.imageUser = urlImg;
          });
        })
      );
  }

  closeSuscription(){
    return this.router.navigate(['welcome'])
  }
}
