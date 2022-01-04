import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { 
    path: 'auth', 
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ) 
  },
  { 
    path: 'play', 
    loadChildren: () => import('./videos/videos.module').then( m => m.VideosModule ), 
    canActivate: [AuthGuard], 
    canLoad: [AuthGuard]
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminModule ), 
    canActivate: [AuthGuard, AdminGuard], 
    canLoad: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: 'play' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
