import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { ElegirCarrerasComponent } from './elegir-carreras/elegir-carreras.component';
import { ElegirMateriasComponent } from './elegir-materias/elegir-materias.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'carreras', component: ElegirCarrerasComponent },
      { path: 'materias', component: ElegirMateriasComponent },
      { path: 'perfil', component: EditarPerfilComponent },
      { path: '**', redirectTo: 'home' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
