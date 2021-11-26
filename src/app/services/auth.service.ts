import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //TODO: Cambiar las reglas de leer, escribir del firestore a futuro en produccion.

  constructor( private af: AngularFireAuth,
               private firestore: AngularFirestore   
  ) { }

  //TODO: Manejo de errores del firebase en el registro.
  register(usuario: User) {
    this.af.createUserWithEmailAndPassword( usuario.email, usuario.password! )
      .then( (userCredential: any)  => {
        delete usuario.password;
        usuario.uid = userCredential.user.uid;
        this.agregarUsuario( usuario );
      })
      .catch( error => {
        console.log('Error al registrar el usuario:', error);
    });
  }

  agregarUsuario( usuario: any ) {

    const user: User = {
      uid: usuario.uid,
      email: usuario.email,
      nombre: usuario.nombre
    }

    this.firestore.collection('users').add( user )
      .then()
      .catch( error => {
        console.log('Error al agregar el usuario:', error);
    })
  }
}
