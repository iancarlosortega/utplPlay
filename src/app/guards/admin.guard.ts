import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';

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

  canActivate(): boolean {

      this.obs1 = this.afAuth.idTokenResult.subscribe( idTokenResult => {
        const claims = idTokenResult?.claims;
        console.log('Can Activate');
        if( claims ){
          if( claims!['admin'] === null ||  claims!['editor'] === null ) {
            console.log('not admin');
            this.router.navigateByUrl('/play')
          }
        }
      });
      return true;
  }
  canLoad(): boolean {
      this.obs2 = this.afAuth.idTokenResult.subscribe( idTokenResult => {
        const claims = idTokenResult?.claims;
        console.log('Can Load');
        if( claims ){
          if( claims!['admin'] === null || claims!['editor'] === null ) {
            console.log('not admin');
            this.router.navigateByUrl('/play')
          }
          // if( claims!['admin'] ||  claims!['editor'] ) {
          //   this.router.navigateByUrl('/admin')
          // } else {
          //   this.router.navigateByUrl('/play')
          // }
        }
      });
      return true;
  }
}
