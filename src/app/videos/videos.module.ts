import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosRoutingModule } from './videos-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ElegirMateriasComponent } from './elegir-materias/elegir-materias.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    ElegirMateriasComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    VideosRoutingModule,
    SharedModule
  ]
})
export class VideosModule { }
