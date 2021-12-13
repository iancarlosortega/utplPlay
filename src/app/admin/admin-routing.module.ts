import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarrerasComponent } from './carreras/carreras.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { MateriasComponent } from './materias/materias.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ListadoVideosComponent } from './videos/listado-videos/listado-videos.component';
import { SubirVideoComponent } from './videos/subir-video/subir-video.component';

const routes: Routes = [
  {
    path: '',
    component: HomeAdminComponent,
    children: [
      
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'carreras', component: CarrerasComponent },
      { path: 'materias', component: MateriasComponent },
      { path: 'subir/videos', component: SubirVideoComponent },
      { path: 'editar/video/:id', component: SubirVideoComponent },
      { path: 'videos', component: ListadoVideosComponent },
      { path: '**', redirectTo: 'dashboard' },
  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
