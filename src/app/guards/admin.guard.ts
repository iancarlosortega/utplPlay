import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad {

  constructor( private afAuth: AngularFireAuth, 
               private authService: AuthService,
               private router:Router 
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      this.afAuth.idTokenResult.subscribe( idTokenResult => {
        const claims = idTokenResult?.claims;
        if( !claims ||  !claims['admin'] || !claims['editor'] ) {
          this.router.navigateByUrl('/play')
        } 
      });
      return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.afAuth.idTokenResult.subscribe( idTokenResult => {
        const claims = idTokenResult?.claims;
        if( !claims ||  !claims['admin'] || !claims['admin']) {
          this.router.navigateByUrl('/play')
        } 
      });
      return true;
  }
}
