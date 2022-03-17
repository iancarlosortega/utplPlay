import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [],
  exports:[
    ButtonModule,
    CheckboxModule,
    ChipsModule,
    InputTextModule,
    MultiSelectModule,
    PaginatorModule,
    ProgressSpinnerModule,
    SidebarModule,
    TableModule,
    TooltipModule,
  ]
})
export class PrimeNGModule { }
