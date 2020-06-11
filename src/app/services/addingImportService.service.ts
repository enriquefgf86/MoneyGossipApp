import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { addImport } from './LoginService.service';

@Injectable()
export class AddingImportService{

constructor(private formBuilder:FormBuilder){}

buildAddImport(){
  return this.formBuilder.group({
    key:this.formBuilder.control(''),
    import:this.formBuilder.control(300),
    previous:this.formBuilder.control(0),

  })
}
getAddimportBuilt(ngForm){
  return {
    key: ngForm.value.key,
    import: ngForm.value.import
  } as addImport;
}
}


