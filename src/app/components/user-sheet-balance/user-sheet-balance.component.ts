import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  LoginService,
  addImport,
  addNewImport,
} from 'src/app/services/LoginService.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AddingImportService } from 'src/app/services/addingImportService.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-sheet-balance',
  templateUrl: './user-sheet-balance.component.html',
  styleUrls: ['./user-sheet-balance.component.css'],
})
export class UserSheetBalanceComponent implements OnInit {
  //variable que almancena el valor de dinero total traido desde el service
  amountInAccount = 0;
  //variables que almancenan los valores key para los objetos de expenses , incomings
  collectionsAny: any;

  allExpensesKeys: any;
  allIncomingsKeys: any;

  //Variables para mostrar un selector u otro (expenses o incomings)
  state: string;
  show: boolean = false;
  //variables declaradas para dar valor a la opcion no seleccionable
  options: any = null;
  optionsExp: any = null;
  optionsInc: any = null;

  expenseSelected: string;
  incomeSelected: string;

  income: any[] = [];
  expense: any[] = [];

  allIncomings: any;
  allExpenses: any;

  expensesTotal: number;
  incomingsTotal: number;

  preInfComp: any;
  preInf: any;

  importNgForm: FormGroup;
  addNewNgForm: FormGroup;
  eventValue: string;

  userId: any;

  @ViewChild('open') openModal: ElementRef;

  @ViewChild('close') closeModal: ElementRef;
  @ViewChild('closeAdd') closeNewModal: ElementRef;

  constructor(
    private loginService: LoginService,
    private addinImport: AddingImportService,
    private amountBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.importNgForm = this.amountBuilder.group({
      type: new FormControl(),
      previous: new FormControl(),
      key: new FormControl(),
      import: new FormControl(),
    });

    this.addNewNgForm = this.amountBuilder.group({
      Type: new FormControl(),
      newKey: new FormControl(),
      newImport: new FormControl(),
    });
  }

  ngOnInit(): void {
    // //asignando el monto de dinero en general traido desde el service
    // this.amountInAccount = this.loginService.totalAmount;
    // //proceso de extraccion del objeto allExpenses traido desde el service , para posteriormente , asignandosle
    // //a la variable this.allKeysExpenses obtener su key
    // let keysExpenses = this.loginService.allExpenses;
    // this.allExpenses = Object(keysExpenses);
    // this.allExpensesKeys = Object.keys(keysExpenses);
    // //proceso de extraccion del objeto allIncomingss traido desde el service , para posteriormente , asignandosle
    // //a la variable this.allKeysIncomingss obtener su key
    // let keysIncomings = this.loginService.allIncomings;
    // this.allIncomings = Object(keysIncomings);
    // this.allIncomingsKeys = Object.keys(keysIncomings);
    //midmo proceso para obtner los key del tipo de itmem incomings  o expenses
    let keysCollections = this.loginService.collections;
    this.collectionsAny = Object.keys(keysCollections);

    this.loginService.getUserState().subscribe((data) => {
      if (data) {
        let path = this.firestore.collection('users').doc(data.uid);
        let incomings = path.collection('Incomings').doc(data.uid);
        let expenses = path.collection('Expenses').doc(data.uid);
        this.userId = data.uid;
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
              this.amountInAccount =
                this.amountInAccount - this.allExpenses[values];
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

              this.amountInAccount =
                this.amountInAccount + this.allIncomings[values];
            }
          }); //determinando los ingresos para sacar su total
      }
    });
  }

  async itemSelected(event) {
    this.eventValue = await event.target.value;

    this.state = await this.eventValue;

    if (event.target.value === 'select') {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  async subItemSelected(event) {
    if (this.show === false) {
      return;
    }
    if (this.state === 'Expenses') {
      return await ((this.expenseSelected = event.target.value),
      this.openPopModal(),
      (this.incomeSelected = null));
    } else if (this.state === 'Incomings') {
      return await ((this.incomeSelected = event.target.value),
      this.openPopModal(),
      (this.expenseSelected = null));
    }
  }

  private async openPopModal() {
    this.income = [];
    this.income.push(this.incomeSelected);

    this.expense = [];
    this.expense.push(this.expenseSelected);

    this.importNgForm.get('import').reset(); //reseting filed a cero cuando la forma se abre

    if (this.state === 'Incomings') {
      let filtering = await Object.keys(this.allIncomings)
        .filter((key) => this.income.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.allIncomings[key];
          return (
            ((this.preInfComp = Object.values(obj)),
            (this.preInf = this.preInfComp[0])),
            obj
          );
        }, {});
      console.log(filtering, this.income, this.openModal.nativeElement);
    } else if (this.state === 'Expenses') {
      let filtering = await Object.keys(this.allExpenses)
        .filter((key) => this.expense.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.allExpenses[key];
          return (
            ((this.preInfComp = Object.values(obj)),
            (this.preInf = this.preInfComp[0])),
            obj
          );
        }, {});

      console.log(filtering, this.expense, this.openModal.nativeElement);
    }
    return await this.openModal.nativeElement.click();
  }

  private closePopModal() {
    return this.closeModal.nativeElement.click();
  }

  private closeNewPopModal() {
    return this.closeNewModal.nativeElement.click();
  }

  addUniqueImport() {
    this.loginService.addingImport(this.importNgForm.value as addImport);
    this.closePopModal();
  }

  addNewConcept() {
    this.loginService.addNewItem(this.addNewNgForm.value as addNewImport);
    this.closeNewPopModal();
  }
  showChanger() {
    return (this.show = !this.show);
  }
  routingBalance() {
    this.router.navigate(['user/' + this.userId + '/details']);
  }
}
