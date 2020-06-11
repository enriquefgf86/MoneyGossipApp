import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserComponent } from './components/user/user.component';
import { UserSheetBalanceComponent } from './components/user-sheet-balance/user-sheet-balance.component';
import { UserSheetComponent } from './components/user-sheet/user-sheet.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { authguardian } from './guardians/authguardian.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'welcome', component: WelcomePageComponent },

  {
    path: 'user/:id',
    component: UserComponent,
    canActivate: [authguardian],
    children: [{ path: 'details', component: UserSheetComponent }],
  },
  {
    path: 'user/:id/edit_balance',
    component: UserSheetBalanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
