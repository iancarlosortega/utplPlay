import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardGuard } from '../guards/dashboard.guard';

import { CarrerasComponent } from './carreras/carreras.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { ListadoVideosComponent } from './videos/listado-videos/listado-videos.component';
import { MateriasComponent } from './materias/materias.component';
import { SubirVideoComponent } from './videos/subir-video/subir-video.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeAdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
        canActivate: [DashboardGuard],
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [DashboardGuard],
      },
      {
        path: 'carreras',
        component: CarrerasComponent,
        canActivate: [AdminGuard],
      },
      { path: 'materias', component: MateriasComponent },
      { path: 'subir/videos', component: SubirVideoComponent },
      { path: 'editar/video/:id', component: SubirVideoComponent },
      { path: 'videos', component: ListadoVideosComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
