import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class DashboardGuard implements CanActivate, CanLoad {

  constructor( private afAuth: AngularFireAuth, 
      private router:Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.afAuth.idTokenResult.subscribe((idTokenResult) => {
      const claims = idTokenResult?.claims;
      if (claims) {
        if (!claims!['admin']) {
          this.router.navigateByUrl('/admin/carreras');
        }
      }
    });
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.afAuth.idTokenResult.subscribe((idTokenResult) => {
      const claims = idTokenResult?.claims;
      if (claims) {
        if (!claims!['admin']) {
          this.router.navigateByUrl('/admin/carreras');
        }
      }
    });
    return true;
  }
}
