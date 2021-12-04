import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from '@firebase/app-compat';
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //TODO: Cambiar las reglas de leer, escribir del firestore a futuro en produccion.

  constructor( private afAuth: AngularFireAuth,
               private firestore: AngularFirestore   
  ) { }

  authState() {
    this.afAuth.onAuthStateChanged( user => {
      console.log(user);
    })


    this.afAuth.authState.subscribe( res => {
      console.log('authstate', res);
    } );
  }

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
    return this.firestore.collection('usuarios').add( usuario );
  }
}
