import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PrimeNGModule } from '../prime-ng/prime-ng.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CarrerasComponent } from './carreras/carreras.component';
import { MateriasComponent } from './materias/materias.component';
import { SubirVideoComponent } from './videos/subir-video/subir-video.component';
import { ListadoVideosComponent } from './videos/listado-videos/listado-videos.component';
import { EliminarComponent } from './eliminar/eliminar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeAdminComponent,
    UsuariosComponent,
    CarrerasComponent,
    MateriasComponent,
    SubirVideoComponent,
    ListadoVideosComponent,
    EliminarComponent,
    MateriasComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    PrimeNGModule,
    SharedModule,
    ModalModule.forRoot(),
  ]
})
export class AdminModule { }
