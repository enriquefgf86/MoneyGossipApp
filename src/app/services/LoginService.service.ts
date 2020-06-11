import { Injectable, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserAuthModel } from '../models/UserAuthModel.model';
import { map, subscribeOn, finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

import { UserDataModel } from '../models/UserDataModel.model';
import { UserResumeAccount } from '../models/UserResumeAccount.model';
import { Router } from '@angular/router';
import { CollectionModel } from '../models/CollectionsModel.model';
import { auth } from 'firebase/app';
import { AuthClientCollectionModel } from '../models/AuthClientCollectionModel.model';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

export interface SignUpData {
  nameUser: '';
  emailUser: '';
  passwordUser: '';
  imageUser: '';
}

export interface LoginData {
  emailUser: string;
  passwordUser: string;
}

export interface addImport {
  type: string;
  previous: number;
  key: any;
  import: number;
}

export interface addNewImport {
  Type: string;
  newKey: any;
  newImport: number;
}

@Injectable()
export class LoginService {
  //variables
  userauth: UserAuthModel = {
    userEmail: '',
    userName: '',
  };
  userdata: UserDataModel = {
    uid: '',
    restData: '',
  };
  userResumeAccount: UserResumeAccount = {
    amountInAccount: 0,
    allDetails: null,
  };

  authStateUser: boolean;

  userData: string;

  expense: any;
  imgLoguser: any;

  allExpenses: any;
  allIncomings: any;

  allExpensesKeys: any;
  allIncomingsKeys: any;

  totalAmount: number = 0;

  collections: CollectionModel = {
    Expenses: 'Expenses',
    Incomings: 'Incomings',
  };

  expensesTotal: number = 0;
  incomingsTotal: number = 0;

  resumeAccount: UserResumeAccount = {
    amountInAccount: 0,
    allDetails: null,
  };
  allDocsSaved: any[] = [];

  userId: string;

  defaultImage: any;
  imgSelected: any;
  image: any;
  userAuthCollection: AngularFirestoreCollection<AuthClientCollectionModel>;
  userAuthDocument: AngularFirestoreDocument<AuthClientCollectionModel>;
  clientsAuth: Observable<AuthClientCollectionModel[]>;
  clientAuth: Observable<AuthClientCollectionModel>;

  // imagegetter:new EventEmitter<any>();

  //constructor
  constructor(
    private userLogin: AngularFireAuth,
    private docCreator: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage
  ) {
    this.userAuthCollection = docCreator.collection('users');
    if (this.userdata.uid)
      this.userAuthDocument = docCreator
        .collection('users')
        .doc(this.userdata.uid);
  }

  // tslint:disable-next-line: use-lifecycle-interface
  // tslint:disable-next-line: contextual-lifecycle
  ngOnInit(): void {
    this.userLogin.setPersistence(auth.Auth.Persistence.SESSION);

    console.log(this.allExpenses);
    console.log(this.expensesTotal);
    this.getCurrentUseDocument();
  }

  //methods

  async addNewItem(newDataTopass: addNewImport) {
    this.getUserState().subscribe(async (userId) => {
      if (userId) {
        if (newDataTopass.Type == 'Incomings') {
          let path = await this.docCreator
            .collection('users')
            .doc(userId.uid)
            .collection('Incomings')
            .doc(userId.uid);

          let newObjCreator: any = {};
          newObjCreator = await {
            [`${newDataTopass.newKey}`]: newDataTopass.newImport,
          };
          await path.update(newObjCreator);
          await window.location.reload();
        } else if (newDataTopass.Type == 'Expenses') {
          let path = await this.docCreator
            .collection('users')
            .doc(userId.uid)
            .collection('Expenses')
            .doc(userId.uid);

          let newObjCreator: any = {};
          newObjCreator = await {
            [`${newDataTopass.newKey}`]: newDataTopass.newImport,
          };
          await path.update(newObjCreator);
          await window.location.reload();
        } else return;
      }
    });
  }

  async addingImport(dataToPass: addImport) {
    //  let {key:string,import:number}=dataToPass
    this.getUserState().subscribe(async (userId) => {
      if (userId) {
        if (dataToPass.type == 'Incomings') {
          let path = await this.docCreator
            .collection('users')
            .doc(userId.uid)
            .collection('Incomings')
            .doc(userId.uid);

          let objCreator: any = await {};

          objCreator = await {
            [`${dataToPass.key}`]: dataToPass.previous + dataToPass.import,
          };
          console.log(objCreator);

          await path.update(objCreator);
          await window.location.reload();
        } else if (dataToPass.type == 'Expenses') {
          let path = await this.docCreator
            .collection('users')
            .doc(userId.uid)
            .collection('Expenses')
            .doc(userId.uid);

          let objCreator: any = await {};

          objCreator = await {
            [`${dataToPass.key}`]: dataToPass.previous + dataToPass.import,
          };
          console.log(objCreator);

          await path.update(objCreator);
          await window.location.reload();
        }
      }
    });
  }

  async resetSaveBalance() {
    this.getUserState().subscribe(async (userId) => {
      if (userId) {
        let dataSaved = new Date(); //asignado a la variable la fecha en que se crea el save del documento
        let userSaved = await this.docCreator
          .collection('users')
          .doc(userId.uid)
          .collection('Saved')
          .doc(`${dataSaved}`); //creando el documento a manera de fecha con el camino hasta el en el perfile del usuario

        let userExpensesToSave = await this.docCreator
          .collection('users')
          .doc(userId.uid)
          .collection('Expenses')
          .doc(userId.uid);
        console.log(userId.uid);

        let userIncomingsToSave = await this.docCreator
          .collection('users')
          .doc(userId.uid)
          .collection('Incomings')
          .doc(userId.uid);

        let expenseObject;
        let incomeObject;

        await userExpensesToSave
          .get()
          .toPromise()
          .then((saved) => {
            expenseObject = Object(saved.data());
          });

        await userIncomingsToSave
          .get()
          .toPromise()
          .then((saved) => {
            incomeObject = Object(saved.data());
          });

        let userDoc = await this.docCreator.collection('users').doc(userId.uid);

        let objCreator = await {
          //creando el objeto de gastos e ingresos a salvar en firebase
          Expenses: expenseObject,
          Incomes: incomeObject,
        };
        await userSaved.set(objCreator);
        await userDoc.set({
          // amountInAccount: 0,
          userEmail: userId.email,
          userimg: userId.photoURL,
          userName: userId.displayName,
        });
        await userDoc.collection('Expenses').doc(userId.uid).set({
          Fees: 0,
          Others: 0,
          Daily: 0,
          Diet: 0,
          Gymn: 0,
          House: 0,
          'Car Insurance': 0,
          'House Insurance': 0,
          'Health Insurance': 0,
        });
        await userDoc.collection('Incomings').doc(userId.uid).set({
          Sales: 0,
          Donations: 0,
          Others: 0,
          Shares: 0,
          Wage: 0,
        });
      }
    });
    await setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  async logInUser(SignUpData: LoginData) {
    let { emailUser, passwordUser } = SignUpData;

    await this.userLogin.setPersistence(auth.Auth.Persistence.SESSION);
    let responseOk = await this.userLogin.signInWithEmailAndPassword(
      emailUser,
      passwordUser
    );

    this.userdata.uid = await responseOk.user.uid;
    this.userdata.restData = await responseOk.user;
    console.log(this.userdata.uid);

    let pathExpenses = await this.docCreator
      .collection('users')
      .doc(this.userdata.uid)
      .collection('Expenses')
      .doc(this.userdata.uid); //

    let pathIncomings = await this.docCreator
      .collection('users')
      .doc(this.userdata.uid)
      .collection('Incomings')
      .doc(this.userdata.uid); //

    await pathExpenses
      .get()
      .toPromise()
      .then(async (items) => {
        this.allExpenses = await Object(items.data());
        this.allExpensesKeys = Object.keys(items.data());
      })
      .then(async () => {
        for (let values in this.allExpenses) {
          this.totalAmount =
            (await this.totalAmount) - this.allExpenses[values];
          this.expensesTotal =
            (await this.expensesTotal) + this.allExpenses[values];
        }
      });

    await pathIncomings
      .get()
      .toPromise()
      .then(async (items) => {
        this.allIncomings = await Object(items.data());
        this.allIncomingsKeys = Object.keys(items.data());
      })
      .then(async () => {
        for (let values in this.allIncomings) {
          this.totalAmount =
            (await this.totalAmount) + this.allIncomings[values];
          this.incomingsTotal =
            (await this.incomingsTotal) + this.allIncomings[values];
        }
      });

    let pathUserName = await this.docCreator
      .collection('users')
      .doc(this.userdata.uid);

    await pathUserName
      .get()
      .toPromise()
      .then(async (result) => {
        if (result.exists) {
          this.resumeAccount.allDetails = await result.get('userName');
          this.resumeAccount.amountInAccount = await this.totalAmount;
        } else return console.log('not Document Found');
      })
      .then(() => {})
      .catch((err) => {
        console.log('Error getting document:', err);
      });

    let pathSavedBalances = await this.docCreator
      .collection('users')
      .doc(this.userdata.uid)
      .collection('Saved')
      .get();
    pathSavedBalances.toPromise().then((query) => {
      query.docs.forEach((doc) => {
        this.allDocsSaved.push(doc.id);
      });
    });

    let image = await this.storage
      .ref(`${this.userdata.restData.email}`)
      .child(`${this.userdata.restData.photoURL.split('.').splice(0, 1)}`);
    await image.getDownloadURL().subscribe((url) => {
      console.log(url);

      this.image = url;
      console.log(url, this.image);
    });
    await this.getCurrentUserData().subscribe((data) => {
      return data;
    });
  }

  async signUpUser(signUpData: SignUpData) {
    let { nameUser, emailUser, passwordUser, imageUser } = signUpData;

    let responseOk = await this.userLogin.createUserWithEmailAndPassword(
      emailUser,
      passwordUser
    );

    this.userdata.uid = responseOk.user.uid;
    this.userdata.restData = responseOk.user;

    await responseOk.user.updateProfile({
      displayName: nameUser,
      photoURL: imageUser.slice(12), //dejando solo el nombre de la imagen sin el path previo
    });

    console.log('displayname setted', responseOk.user.displayName);

    let userDoc = this.docCreator.collection('users').doc(responseOk.user.uid);

    console.log(responseOk.user.displayName);

    await userDoc.set({
      // amountInAccount: this.allIncomings+this.,
      userEmail: responseOk.user.email,
      userimg: responseOk.user.photoURL,
      userName: responseOk.user.displayName,
    });
    await userDoc.collection('Expenses').doc(this.userdata.uid).set({
      Fees: 0,
      Others: 0,
      Daily: 0,
      Diet: 0,
      Gymn: 0,
      House: 0,
      'Car Insurance': 0,
      'House Insurance': 0,
      'Health Insurance': 0,
    });

    await userDoc.collection('Incomings').doc(this.userdata.uid).set({
      Sales: 0,
      Donations: 0,
      Others: 0,
      Shares: 0,
      Wage: 0,
    });

    let image = this.storage
      .ref(`${this.userdata.restData.email}`)
      .child(`${this.userdata.restData.photoURL.split('.').splice(0, 1)}`);

    await image.getDownloadURL().subscribe((url) => {
      console.log(url);

      this.image = url;
      console.log(url, this.image);
    });
  }

  getUserState() {
    return this.userLogin.authState.pipe(
      map((userLoged) => {
        return console.log(userLoged), userLoged;
      })
    );
  }
  getCurrentUserAuth() {
    return this.userLogin.currentUser;
  }
  // editAccountParams() {
  //   this.router.navigate(['user/' + this.userId + '/edit_balance']);
  // }

  getCurrentUserData(): Observable<AuthClientCollectionModel[]> {
    this.clientsAuth = this.userAuthCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const datos = action.payload.doc.data() as AuthClientCollectionModel;
          datos.id = action.payload.doc.id;
          console.log(datos.id, datos);

          return datos;
        });
      })
    );

    return this.clientsAuth;
  }

  getCurrentUseDocument(): Observable<AuthClientCollectionModel> {
    if (this.userdata.uid) {
      this.clientAuth = this.userAuthCollection
        .doc(this.userdata.uid)
        .snapshotChanges()
        .pipe(
          map((change) => {
            return change.payload;
          })
        );
      return this.clientAuth;
    }
  }

  getExpenses() {
    let pathExpenses = this.docCreator
      .collection('users')
      .doc(this.userdata.uid)
      .collection('Expenses')
      .doc(this.userdata.uid);

    let objctExpenses;
    let sumValues = 0;

    pathExpenses
      .get()
      .toPromise()
      .then((obj) => {
        objctExpenses = Object(obj.data());
      })
      .then(() => {
        for (let i in objctExpenses) {
          sumValues = sumValues + objctExpenses[i];
        }
      });

    return sumValues;
  }

  // async clickDetails() {
  //   await this.router.navigate(['user/' + this.userdata.uid + '/details']);
  // }
}
