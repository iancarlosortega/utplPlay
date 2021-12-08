import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AgregarCarreraComponent } from './carreras/agregar-carrera/agregar-carrera.component';
import { ListadoCarrerasComponent } from './carreras/listado-carreras/listado-carreras.component';
import { AgregarMateriaComponent } from './materias/agregar-materia/agregar-materia.component';
import { ListadoMateriasComponent } from './materias/listado-materias/listado-materias.component';
import { SubirVideoComponent } from './videos/subir-video/subir-video.component';
import { ListadoVideosComponent } from './videos/listado-videos/listado-videos.component';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeAdminComponent,
    UsuariosComponent,
    AgregarCarreraComponent,
    ListadoCarrerasComponent,
    AgregarMateriaComponent,
    ListadoMateriasComponent,
    SubirVideoComponent,
    ListadoVideosComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    MaterialModule,
    PrimeNGModule,
    SharedModule
  ]
})
export class AdminModule { }
