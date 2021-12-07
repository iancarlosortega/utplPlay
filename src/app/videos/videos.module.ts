import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosRoutingModule } from './videos-routing.module';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home/home.component';
import { ElegirCarrerasComponent } from './elegir-carreras/elegir-carreras.component';
import { ElegirMateriasComponent } from './elegir-materias/elegir-materias.component';


@NgModule({
  declarations: [
    HomeComponent,
    ElegirCarrerasComponent,
    ElegirMateriasComponent,
  ],
  imports: [
    CommonModule,
    VideosRoutingModule,
    SharedModule,
    PrimeNGModule
  ]
})
export class VideosModule { }
