import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { ElegirCarrerasComponent } from './elegir-carreras/elegir-carreras.component';
import { ElegirMateriasComponent } from './elegir-materias/elegir-materias.component';
import { HistorialComponent } from './historial/historial.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { VerCarreraComponent } from './ver-carrera/ver-carrera.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'carreras', component: ElegirCarrerasComponent },
      { path: 'carrera/:id', component: VerCarreraComponent },
      { path: 'materias', component: ElegirMateriasComponent },
      { path: 'perfil', component: EditarPerfilComponent },
      { path: 'historial', component: HistorialComponent },
      { path: 'nosotros', component: SobreNosotrosComponent },
      { path: '**', redirectTo: 'home' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
