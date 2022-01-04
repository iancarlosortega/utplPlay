import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';
import { SwiperModule } from 'swiper/angular';

import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NavbarComponent } from './navbar/navbar.component';
import { VideoComponent } from './video/video.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { SliderComponent } from './slider/slider.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    NavbarComponent,
    VideoComponent,
    BuscadorComponent,
    SliderComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PrimeNGModule,
    SwiperModule
  ],
  exports: [
    HeaderComponent,
    SidenavComponent,
    NavbarComponent,
    VideoComponent,
    BuscadorComponent,
    SliderComponent,
    BreadcrumbComponent
  ]
})
export class SharedModule { }
