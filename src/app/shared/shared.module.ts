import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';

import { HeaderComponent } from './header/header.component';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NavbarComponent } from './navbar/navbar.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PrimeNGModule
  ],
  exports: [
    HeaderComponent,
    SidenavComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
