import { Component, OnInit } from '@angular/core';
import {  Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from 'src/app/services/ValidationService.service';


@Component({
  selector: 'app-control-messages',
  // templateUrl: './control-messages.component.html',
  template: `
  <div *ngIf="errorMessage !== null"></div>
`,
  styleUrls: ['./control-messages.component.css']
})
export class ControlMessagesComponent  {

  errorMessage: string;
  @Input() control: FormControl;
  constructor() {}

  get errorMessages() {
    for (let propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }

    return null;
  }
}
