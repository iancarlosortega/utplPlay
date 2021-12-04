import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

//TODO: Activar los guards

const routes: Routes = [
  { path: 'play', loadChildren: () => import('./videos/videos.module').then( m => m.VideosModule ) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ) },
  { path: '**', redirectTo: 'play' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
