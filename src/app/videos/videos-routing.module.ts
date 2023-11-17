import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { BusquedaComponent } from './busqueda/busqueda.component';
import { EditarPerfilComponent } from './editar-perfil/editar-perfil.component';
import { ElegirCarrerasComponent } from './elegir-carreras/elegir-carreras.component';
import { ElegirMateriasComponent } from './elegir-materias/elegir-materias.component';
import { HistorialComponent } from './historial/historial.component';
import { HomeComponent } from './home/home.component';
import { SobreNosotrosComponent } from './sobre-nosotros/sobre-nosotros.component';
import { VerCarreraComponent } from './ver-carrera/ver-carrera.component';
import { VerMateriaComponent } from './ver-materia/ver-materia.component';
import { VerVideoComponent } from './ver-video/ver-video.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Home' },
    children: [
      { path: '', component: HomeComponent, data: { breadcrumb: '' } },
      {
        path: 'carreras',
        data: { breadcrumb: 'Carreras' },
        children: [
          {
            path: '',
            component: ElegirCarrerasComponent,
            data: { breadcrumb: '' },
          },
          {
            path: ':slug',
            data: { breadcrumb: 'Ver Carrera' },
            children: [
              {
                path: '',
                component: VerCarreraComponent,
                data: { breadcrumb: '' },
              },
              {
                path: ':slug',
                data: { breadcrumb: 'Ver Asignatura' },
                children: [
                  {
                    path: '',
                    component: VerMateriaComponent,
                    data: { breadcrumb: '' },
                  },
                  {
                    path: ':id',
                    component: VerVideoComponent,
                    data: { breadcrumb: 'Ver Video' },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'materias',
        data: { breadcrumb: 'Asignaturas' },
        children: [
          {
            path: '',
            component: ElegirMateriasComponent,
            data: { breadcrumb: '' },
          },
          {
            path: ':slug',
            data: { breadcrumb: 'Ver Asignatura' },
            children: [
              {
                path: '',
                component: VerMateriaComponent,
                data: { breadcrumb: '' },
              },
              {
                path: ':id',
                component: VerVideoComponent,
                data: { breadcrumb: 'Ver Video' },
              },
            ],
          },
        ],
      },
      {
        path: 'video/:id',
        component: VerVideoComponent,
        data: { breadcrumb: 'Ver Video' },
      },
      {
        path: 'perfil',
        component: EditarPerfilComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Editar Perfil' },
      },
      {
        path: 'historial',
        component: HistorialComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Historial' },
      },
      {
        path: 'nosotros',
        component: SobreNosotrosComponent,
        data: { breadcrumb: 'Sobre Nosotros' },
      },
      {
        path: 'buscar/:id',
        component: BusquedaComponent,
        data: { breadcrumb: 'Búsqueda' },
      },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideosRoutingModule {}
