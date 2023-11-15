import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  implements OnDestroy {

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
        if( claims ){
          if( claims!['editor'] === null ) {
            console.log('not editor');
            this.router.navigateByUrl('/play')
          }
        }
      });
      return true;
  }
  canLoad(): boolean {
      this.obs2 = this.afAuth.idTokenResult.subscribe( idTokenResult => {
        const claims = idTokenResult?.claims;
        if( claims ){
          if(claims!['editor'] === null ) {
            console.log('not editor');
            this.router.navigateByUrl('/play')
          }
        }
      });
      return true;
  }
}