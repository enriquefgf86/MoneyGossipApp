import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { UserSheetComponent } from './components/user-sheet/user-sheet.component';
import { UserSheetBalanceComponent } from './components/user-sheet-balance/user-sheet-balance.component';
import { UsersComponent } from './components/users/users.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { environment } from 'src/environments/environment';
import { LoginService } from './services/LoginService.service';
import { LogOutService } from './services/LogOutService.service';
import { AuthService } from './services/AuthService.service';
import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { ValidationService } from './services/ValidationService.service';
import { SignFormService } from './services/SignInFormService.service';
import { HttpClientModule } from '@angular/common/http';
import { AddingImportService } from './services/addingImportService.service';
import { authguardian } from './guardians/authguardian.guard';
import {
  AngularFirestoreModule,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  SETTINGS,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    UserSheetComponent,
    UserSheetBalanceComponent,
    UsersComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    FooterComponent,
    WelcomePageComponent,
    ControlMessagesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FlashMessagesModule,
    AngularFireModule.initializeApp(
      environment.firebaseConfig,
      'ngExpenseClassifier'
    ),
    // AngularFirestoreDocument,
    // AngularFirestoreCollection,
  ],
  providers: [
    LoginService,
    LogOutService,
    AuthService,
    ValidationService,
    SignFormService,
    HttpClientModule,
    AddingImportService,
    authguardian,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
