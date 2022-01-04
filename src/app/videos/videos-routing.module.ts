import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { ElegirCarrerasComponent } from './elegir-carreras/elegir-carreras.component';
import { ElegirMateriasComponent } from './elegir-materias/elegir-materias.component';
import { HistorialComponent } from './historial/historial.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { VerCarreraComponent } from './ver-carrera/ver-carrera.component';
import { VerMateriaComponent } from './ver-materia/ver-materia.component';
import { VerVideoComponent } from './ver-video/ver-video.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Home' },
    children: [
      { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' } },
      { 
        path: 'carreras', 
        data: { breadcrumb: 'Carreras' },
        children: [
          { path: '', component: ElegirCarrerasComponent, data: { breadcrumb: '' } },
          { path: ':id', component: VerCarreraComponent, data: { breadcrumb: 'Ver Carrera' } },
        ]
      },
      { 
        path: 'materias', 
        data: { breadcrumb: 'Materias' },
        children: [
          { path: '', component: ElegirMateriasComponent, data: { breadcrumb: '' } },
          { path: ':id', component: VerMateriaComponent, data: { breadcrumb: 'Ver Materia' } },
        ]
      },
      { path: 'video/:id', component: VerVideoComponent, data: { breadcrumb: 'Ver Video' } },
      { path: 'perfil', component: EditarPerfilComponent, data: { breadcrumb: 'Editar Perfil' } },
      { path: 'historial', component: HistorialComponent, data: { breadcrumb: 'Historial' } },
      { path: 'nosotros', component: SobreNosotrosComponent, data: { breadcrumb: 'Sobre Nosotros' } },
      { path: '**', redirectTo: 'home' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
