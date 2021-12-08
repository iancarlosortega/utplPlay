import { NgModule } from '@angular/core';

import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';



@NgModule({
  declarations: [],
  exports:[
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    TableModule
  ]
})
export class PrimeNGModule { }
