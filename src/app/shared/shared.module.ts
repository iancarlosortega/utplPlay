import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';
import { SwiperModule } from 'swiper/angular';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SliderComponent } from './slider/slider.component';
import { VideoComponent } from './video/video.component';



@NgModule({
  declarations: [
    BreadcrumbComponent,
    HeaderComponent,
    NavbarComponent,
    SidenavComponent,
    SliderComponent,
    VideoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PrimeNGModule,
    SwiperModule,
  ],
  exports: [
    BreadcrumbComponent,
    HeaderComponent,
    NavbarComponent,
    SidenavComponent,
    SliderComponent,
    VideoComponent,
  ]
})
export class SharedModule { }
