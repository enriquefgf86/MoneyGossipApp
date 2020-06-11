import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/LoginService.service';
import { AuthClientCollectionModel } from 'src/app/models/AuthClientCollectionModel.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-sheet',
  templateUrl: './user-sheet.component.html',
  styleUrls: ['./user-sheet.component.css'],
})
export class UserSheetComponent implements OnInit {
  allExpenses: any = {};
  allExpensesKeys: any;

  allIncomings: any = {};
  allIncomingsKeys: any;

  expensesTotal: number = 0;
  incomingsTotal: number = 0;

  detailsDoc: AuthClientCollectionModel[];

  userId:string;

  constructor(
    private loginService: LoginService,
    private userInfo: AngularFirestore,
    private router: Router,
    private auth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    // this.incomingsTotal = this.loginService.incomingsTotal;
    // this.expensesTotal = this.loginService.expensesTotal;

    // this.allExpenses = this.loginService.allExpenses;
    // this.allIncomings = this.loginService.allIncomings;

    this.loginService.getUserState().subscribe((data) => {
      if (data) {
        let path = this.userInfo.collection('users').doc(data.uid);
        let incomings = path.collection('Incomings').doc(data.uid);
        let expenses = path.collection('Expenses').doc(data.uid);
        this.userId=data.uid;

        expenses
          .get()
          .toPromise()
          .then((exp) => {
            this.allExpenses = Object(exp.data());
            this.allExpensesKeys = Object.keys(exp.data());
          })
          .then(() => {
            for (let values in this.allExpenses) {
              this.expensesTotal =
                this.expensesTotal + this.allExpenses[values];
            }
          }); //determinando los gastos para sacar su total

        incomings
          .get()
          .toPromise()
          .then((exp) => {
            this.allIncomings = Object(exp.data());
            this.allIncomingsKeys = Object.keys(exp.data());
          })
          .then(() => {
            for (let values in this.allIncomings) {
              this.incomingsTotal =
                this.incomingsTotal + this.allIncomings[values];
            }
          }); //determinando los ingresos para sacar su total
      }
    });
  }
  editAccounts() {
    // this.loginService.editAccountParams();
    this.router.navigate(['user/' + this.userId + '/edit_balance']);
  }
  resetSave() {
    return this.loginService.resetSaveBalance();
  }
}
