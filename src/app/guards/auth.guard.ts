import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private afAuth: AngularFireAuth, 
               private router: Router
  ) {}

  async canActivate(): Promise<boolean>  {
    this.afAuth.authState.subscribe( user => {
      if( user == null ) {
        this.router.navigate(['/auth'], { state: { redirect: this.router.url } });
      }
    })
    return true;
  }
  async canLoad(): Promise<boolean> {
    this.afAuth.authState.subscribe( user => {
      if( user == null ) {
        this.router.navigate(['/auth'], { state: { redirect: this.router.url } });
      }
    })
    return true;
  }
}
