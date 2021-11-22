import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElegirMateriasComponent } from './elegir-materias/elegir-materias.component';

const routes: Routes = [
  {
    path: '',
    component: ElegirMateriasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
