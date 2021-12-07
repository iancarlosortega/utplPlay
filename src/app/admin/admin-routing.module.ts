import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgregarCarreraComponent } from './carreras/agregar-carrera/agregar-carrera.component';
import { ListadoCarrerasComponent } from './carreras/listado-carreras/listado-carreras.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { AgregarMateriaComponent } from './materias/agregar-materia/agregar-materia.component';
import { ListadoMateriasComponent } from './materias/listado-materias/listado-materias.component';
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
      { path: 'agregar/carrera', component: AgregarCarreraComponent },
      { path: 'carreras', component: ListadoCarrerasComponent },
      { path: 'agregar/materia', component: AgregarMateriaComponent },
      { path: 'materias', component: ListadoMateriasComponent },
      { path: 'subir/videos', component: SubirVideoComponent },
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
