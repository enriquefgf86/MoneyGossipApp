import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoginService } from 'src/app/services/LoginService.service';
import { UserResumeAccount } from 'src/app/models/UserResumeAccount.model';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  resumeAccount: UserResumeAccount = {
    amountInAccount: 0,
    allDetails: null,
  };
  // allExpenses: any = 0;
  // allIncomings: any = 0;

  detailsExpenses: any = {};

  allDatesBalance: any[] = [];
  balances: any = null;

  dateSelected: any;
  selected: any;
  datos: any;
  preInf: any;
  getInf: any;
  getInfExpenses: any;
  getInfIncomes: any;

  allExpenses: any;
  allExpensesKeys: any;
  totalExpenses: any;

  allIncomings: any;
  allIncomingsKeys: any;
  totalIncomings: any;

  showBal: boolean = false;
  changeState: boolean = true;
  Object = Object;
  userData: any;
  userId: string;

  @ViewChild('openBalance') openModalResumeBalance: ElementRef;
  @ViewChild('close') closeModalResumeBalance: ElementRef;
  image: any;

  constructor(
    private firestoreAccess: AngularFirestore,
    private userLogged: LoginService,
    private router: Router,
    private imgStorage: AngularFireStorage // private auth:AuthSer
  ) {}

  ngOnInit(): void {
    // this.resumeAccount.allDetails = this.userLogged.resumeAccount.allDetails;
    // this.resumeAccount.amountInAccount = this.userLogged.resumeAccount.amountInAccount;
    // this.allDatesBalance = this.userLogged.allDocsSaved;
    // console.log(this.allDatesBalance);

    this.userLogged.getUserState().subscribe((userData) => {
      if (userData) {
        console.log(userData);
        let path = this.firestoreAccess.collection('users').doc(userData.uid);
        let incomings = path.collection('Incomings').doc(userData.uid);
        let expenses = path.collection('Expenses').doc(userData.uid);
        let savedStates = path.collection('Saved');
        this.userId = userData.uid;

        let image = this.imgStorage
          .ref(`${userData.email}`)
          .child(`${userData.photoURL.split('.').splice(0, 1)}`);
        image.getDownloadURL().subscribe((url) => {
          console.log(url);

          this.image = url;
          console.log(url, this.image);
        }); //recargando la imagen del back end al iniciar

        path
          .get()
          .toPromise()
          .then((data) => {
            if (data.exists) {
              return (this.resumeAccount.allDetails = data.get('userName'));
            }
          }); //recargando el nombre

        expenses
          .get()
          .toPromise()
          .then((exp) => {
            this.allExpenses = Object(exp.data());
            this.allExpensesKeys = Object.keys(exp.data());
          })
          .then(() => {
            for (let values in this.allExpenses) {
              this.resumeAccount.amountInAccount =
                this.resumeAccount.amountInAccount - this.allExpenses[values];
              this.totalExpenses =
                this.totalExpenses + this.allExpenses[values];
            }
          }); //determinando los gastos para sacar su total asi como su deduccion del total

        incomings
          .get()
          .toPromise()
          .then((exp) => {
            this.allIncomings = Object(exp.data());
            this.allIncomingsKeys = Object.keys(exp.data());
          })
          .then(() => {
            for (let values in this.allIncomings) {
              this.resumeAccount.amountInAccount =
                this.resumeAccount.amountInAccount + this.allIncomings[values];
              this.totalIncomings =
                this.totalIncomings + this.allIncomings[values];
            }
          }); //determinando los ingresos para sacar su total asi como su deduccion del total

        savedStates
          .get()
          .toPromise()
          .then((items) => {
            items.docs.forEach((docItem) => {
              this.allDatesBalance.push(docItem.id);
            });
          }); //determinando los balances guardados y asignandoeles al array allDatesBalance
      } //sobre el cual se inicializa el dropdaown para seleccionar segun su fecha
    });
  }

  async userSheet() {
    await this.router.navigate(['user/' + this.userId + '/details']);
    this.changeState = false;
  }

  async openResumeBalanceModal() {
    this.userLogged.getUserState().subscribe(async (data) => {
      if (data) {
        this.selected = [];
        this.selected.push(this.dateSelected);

        let filteringDocSelected = await this.allDatesBalance
          .filter(async (item) => this.selected.includes(item))
          .reduce(async (obj, item) => {
            obj[item] = await this.allDatesBalance[item];
            return (
              await ((this.datos = Object.keys(obj)),
              (this.preInf = this.datos)),
              obj,
              console.log(this.datos)
            );
          }, {});

        let pathToBalanceSelected = await this.firestoreAccess
          .collection('users')
          .doc(data.uid)
          .collection('Saved')
          .doc(this.datos[0]);
        console.log(this.datos);

        await pathToBalanceSelected
          .get()
          .toPromise()
          .then(async (obj) => {
            this.getInf = await obj.data();
          });

        this.getInfExpenses = this.getInf.Expenses;
        this.getInfIncomes = this.getInf.Incomes;
        console.log(filteringDocSelected);
        console.log(this.openModalResumeBalance.nativeElement);

        return await this.openModalResumeBalance.nativeElement.click();
      }
    });
  }

  balanceSelected(event) {
    this.dateSelected = event.target.value;
    this.openResumeBalanceModal();
  }

  private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string {
    const htmlStr: string[] = [];
    const elements = document.getElementsByTagName(tagName);
    for (let idx = 0; idx < elements.length; idx++) {
      htmlStr.push(elements[idx].outerHTML);
    }

    return htmlStr.join('\r\n');
  } //esta funcion preserva el estilo de la pagina a imprimir en el html

  printBalance() {
    const printContents = document.getElementById('printModal').innerHTML;
    const stylesHtml = this.getTagsHtml('style');
    const linksHtml = this.getTagsHtml('link');

    const popupWin = window.open(
      '',
      '_blank',
      'top=10,left=10,height=100%,width=auto'
    );
    popupWin.document.open();
    popupWin.document.write(`
        <html>
            <head>
                <title>Print tab</title>
                ${linksHtml}
                ${stylesHtml}

            </head>
            <body onload="window.print(); window.close()">
                ${printContents}
            </body>
        </html>
        `);
    popupWin.document.close();
    this.closePopBalanceModal();
  }

  closePopBalanceModal() {
    return this.closeModalResumeBalance.nativeElement.click();
  }

  showState() {
    return (this.showBal = false);
  }
  hideState() {
    return (this.showBal = true);
  }
}
