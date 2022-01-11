import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanLoad, OnDestroy {

  obs1!: Subscription;
  obs2!: Subscription;

  constructor( private afAuth: AngularFireAuth,
               private router:Router 
  ) {}
  ngOnDestroy(): void {
    this.obs1.unsubscribe()
    this.obs2.unsubscribe()
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      this.obs1 = this.afAuth.idTokenResult.subscribe( idTokenResult => {
        const claims = idTokenResult?.claims;
        if( claims ){
          if( claims!['admin'] ||  claims!['editor'] ) {
            this.router.navigateByUrl('/admin')
          } else {
            this.router.navigateByUrl('/play')
          }
        }
      });
      return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.obs2 = this.afAuth.idTokenResult.subscribe( idTokenResult => {
        const claims = idTokenResult?.claims;
        if( claims ){
          if( claims!['admin'] ||  claims!['editor'] ) {
            this.router.navigateByUrl('/admin')
          } else {
            this.router.navigateByUrl('/play')
          }
        }
      });
      return true;
  }
}
