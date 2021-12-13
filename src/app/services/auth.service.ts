import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Router } from '@angular/router';
import firebase from '@firebase/app-compat';
import { User } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //TODO: Cambiar las reglas de leer, escribir del firestore a futuro en produccion.

  constructor( private afAuth: AngularFireAuth,
               private firestore: AngularFirestore,
               private functions: AngularFireFunctions,
               private router: Router,
               private http: HttpClient
  ) {}

  //TODO: Manejo de errores del firebase en el registro.
  register(usuario: User) {
    return this.afAuth.createUserWithEmailAndPassword( usuario.email, usuario.password! );
  }

  loginEmailPassword( email: string, password: string ) {
    return this.afAuth.signInWithEmailAndPassword( email, password );
  }

  loginGoogle() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.signInWithPopup(googleAuthProvider);
  }

  async logout() {
    await this.afAuth.signOut();
  }

  agregarUsuario( usuario: User ) {
    return this.firestore.collection('usuarios').doc( usuario.uid ).set( usuario );
  }


  //TODO: Agregar con el plan avanzado de firebase con Cloud Functions
  // agregarRolAdmin( email: string ) {
  //   return this.http.post(`${ environment.baseURL }/api/addAdminRole`, { email });
  // }

  obtenerClaims() {
    return this.afAuth.idTokenResult;
  }

}
