import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AngularFireAuthGuard, customClaims, hasCustomClaim, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { map, pipe } from 'rxjs';
import { AdminGuard } from './guards/admin.guard';

const redirectUnauthorizedToLogin = () => pipe( customClaims, map( claims => claims.admin ? ['admin'] : ['play'] ));

const routes: Routes = [
  { 
    path: 'auth', 
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ) 
  },
  { 
    path: 'play', 
    loadChildren: () => import('./videos/videos.module').then( m => m.VideosModule ), 
    // canActivate: [AuthGuard], 
    // canLoad: [AuthGuard] 
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
