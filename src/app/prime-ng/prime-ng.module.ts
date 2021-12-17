import { NgModule } from '@angular/core';

import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {SidebarModule} from 'primeng/sidebar';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {TreeSelectModule} from 'primeng/treeselect';



@NgModule({
  declarations: [],
  exports:[
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    SidebarModule,
    TableModule,
    TooltipModule,
    TreeSelectModule
  ]
})
export class PrimeNGModule { }
