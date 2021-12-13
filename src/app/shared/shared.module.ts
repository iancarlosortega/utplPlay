import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';

import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NavbarComponent } from './navbar/navbar.component';
import { VideoComponent } from './video/video.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    NavbarComponent,
    VideoComponent
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
    NavbarComponent,
    VideoComponent
  ]
})
export class SharedModule { }
