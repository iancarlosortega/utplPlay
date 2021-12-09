import { NgModule } from '@angular/core';

import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {TableModule} from 'primeng/table';



@NgModule({
  declarations: [],
  exports:[
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    MessageModule,
    MessagesModule,
    TableModule
  ]
})
export class PrimeNGModule { }
