import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosRoutingModule } from './videos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home/home.component';
import { ElegirCarrerasComponent } from './elegir-carreras/elegir-carreras.component';
import { ElegirMateriasComponent } from './elegir-materias/elegir-materias.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { VerCarreraComponent } from './ver-carrera/ver-carrera.component';
import { HistorialComponent } from './historial/historial.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { VerMateriaComponent } from './ver-materia/ver-materia.component';


@NgModule({
  declarations: [
    HomeComponent,
    ElegirCarrerasComponent,
    ElegirMateriasComponent,
    EditarPerfilComponent,
    VerCarreraComponent,
    HistorialComponent,
    SobreNosotrosComponent,
    VerMateriaComponent,
  ],
  imports: [
    CommonModule,
    VideosRoutingModule,
    SharedModule,
    PrimeNGModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class VideosModule { }
