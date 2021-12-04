import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { HeaderComponent } from './header/header.component';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PrimeNGModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class SharedModule { }
