import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Carrera } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor( private firestore: AngularFirestore ) { }

  // Usuarios

  obtenerUsuarios() {
    return this.firestore.collection('usuarios').get();
  }

  // Carreras

  obtenerCarreras(){
    const carrerasCollection = this.firestore.collection('carreras');

    return carrerasCollection.snapshotChanges()
      .pipe(
        map(actions => {       
          return actions.map(a => {
            const data = a.payload.doc.data() as Carrera;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      )
  }

  agregarCarrera( carrera: Carrera ) {
    return this.firestore.collection('carreras').add(carrera);
  }

  getCarreraById(id: string) {
    return this.firestore.collection('carreras').doc(id).snapshotChanges();
  }

  actualizarCarrera(id: string, data: Carrera ) {
    return this.firestore.collection('carreras').doc(id).update( {
      nombre: data.nombre,
      num_ciclos: data.num_ciclos
    });
  }

  eliminarCarrera( id: string ) {
    return this.firestore.collection('carreras').doc(id).delete();
  }

  
  

}
