import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private afAuth: AngularFireAuth, 
               private router:Router 
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>  {
    this.afAuth.authState.subscribe( user => {
      if( user == null ) {
        this.router.navigate(['/auth']);
      }
    })
    return true;
  }
  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean | UrlTree> {
      this.afAuth.authState.subscribe( user => {
        if( user == null ) {
          this.router.navigate(['/auth']);
        }
      })
      return true;
  }
}
