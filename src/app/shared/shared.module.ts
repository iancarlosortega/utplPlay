import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { HeaderComponent } from './header/header.component';
import { LogoutComponent } from './logout/logout.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LogoutComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    HeaderComponent,
    LogoutComponent
  ]
})
export class SharedModule { }
