import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map } from 'rxjs';
import { arrayUnion, arrayRemove } from '@angular/fire/firestore';
import {
  Area,
  Career,
  Course,
  Records,
  User,
  Video,
  CareerMin,
} from '../interfaces/interfaces';
import { FileUpload } from '../admin/models/file-upload-model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private basePathCarreras = '/careers';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // Usuarios

  obtenerUsuarios() {
    const usuariosCollection = this.firestore.collection('users');
    return usuariosCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as User;
          data.uid = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  obtenerUsuarioPorId(id: string) {
    const usuariosCollection = this.firestore.collection('users').doc(id);
    return usuariosCollection.snapshotChanges().pipe(
      map((a) => {
        const data = a.payload.data() as User;
        data.uid = a.payload.id;
        return data;
      })
    );
  }

  actualizarHistorialUsuario(uid: string, record: Records) {
    this.firestore
      .collection('users', (ref) =>
        ref.where('search_history', 'array-contains', record)
      )
      .get()
      .subscribe((res) => {
        if (res.docs.length > 0) {
          this.firestore
            .collection('users')
            .doc(uid)
            .update({
              search_history: arrayRemove(record),
            });
        }
        this.firestore
          .collection('users')
          .doc(uid)
          .update({
            search_history: arrayUnion(record),
          });
      });
  }

  //TODO: Agregar eliminar historial

  // Carreras

  obtenerCarreras() {
    const carrerasCollection = this.firestore.collection('careers');
    return carrerasCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Career;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  obtenerCarreraPorId(id: string) {
    const carrerasCollection = this.firestore.collection('careers').doc(id);
    return carrerasCollection.snapshotChanges().pipe(
      map((a) => {
        const data = a.payload.data() as Career;
        data.id = a.payload.id;
        return data;
      })
    );
  }

  obtenerCarreraPorSlug(slug: string) {
    const carrerasCollection = this.firestore.collection('careers', (ref) =>
      ref.where('slug', '==', slug)
    );
    return carrerasCollection.get().pipe(
      map((a) => {
        const data = a.docs[0].data() as Career;
        data.id = a.docs[0].id;
        return data;
      })
    );
  }

  obtenerCarrerasPorArea(area: Area) {
    const carrerasCollection = this.firestore.collection('careers', (ref) =>
      ref.where('area', '==', area)
    );
    return carrerasCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Career;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  agregarCarrera(fileUpload: FileUpload, carreraData: Career, tipo: string) {
    const filePath = `${this.basePathCarreras}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    //Esperar a obtener el link de descarga del archivo subido
    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            carreraData.photo_url = downloadURL;

            if (tipo === 'editar') {
              this.actualizarCarrera(carreraData);
            } else {
              this._agregarCarrera(carreraData);
            }
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }

  private _agregarCarrera(carrera: Career) {
    return this.firestore.collection('careers').add(carrera);
  }

  actualizarCarrera(carrera: Career) {
    return this.firestore.collection('careers').doc(carrera.id).update(carrera);
  }

  eliminarCarrera(carrera: Career) {
    return this.eliminarCarreraFirestore(carrera.id)
      .then(() => {
        this.eliminarCarreraStorage(carrera.photo_filename!);
      })
      .catch((error) => console.log(error));
  }

  private eliminarCarreraFirestore(id: string): Promise<void> {
    return this.firestore.collection('careers').doc(id).delete();
  }

  eliminarCarreraStorage(name: string) {
    this.storage.ref(this.basePathCarreras).child(name).delete();
  }

  // Materias

  obtenerMaterias() {
    const materiasCollection = this.firestore.collection('courses');
    return materiasCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Course;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  obtenerMateriasVideos() {
    const materiasCollection = this.firestore.collection('courses');
    return materiasCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Course;
          data.id = a.payload.doc.id;
          delete data.careers;
          return data;
        });
      })
    );
  }

  obtenerMateriasPorCarrera(carrera: CareerMin) {
    const materiasCollection = this.firestore.collection('courses', (ref) =>
      ref.where('careers', 'array-contains', carrera)
    );
    return materiasCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Course;
          data.id = a.payload.doc.id;
          const { careers, keywords, purposes, ...materia } = data;
          return materia;
        });
      })
    );
  }

  agregarMateria(materia: Course) {
    return this.firestore.collection('courses').add(materia);
  }

  obtenerMateriaPorId(id: string) {
    const materiasCollection = this.firestore.collection('courses').doc(id);
    return materiasCollection.snapshotChanges().pipe(
      map((a) => {
        const data = a.payload.data() as Course;
        data.id = a.payload.id;
        return data;
      })
    );
  }

  obtenerMateriaPorSlug(slug: string) {
    const materiasCollection = this.firestore.collection('courses', (ref) =>
      ref.where('slug', '==', slug)
    );
    return materiasCollection.get().pipe(
      map((a) => {
        const data = a.docs[0].data() as Course;
        data.id = a.docs[0].id;
        return data;
      })
    );
  }

  actualizarMateria(materia: Course) {
    return this.firestore.collection('courses').doc(materia.id).update(materia);
  }

  eliminarMateria(id: string) {
    return this.firestore.collection('courses').doc(id).delete();
  }

  // Videos

  obtenerVideos() {
    const videosCollection = this.firestore.collection('videos');
    return videosCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Video;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  obtenerVideoPorId(id: string) {
    const videosCollection = this.firestore.collection('videos').doc(id);
    return videosCollection.snapshotChanges().pipe(
      map((a) => {
        const data = a.payload.data() as Video;
        data.id = a.payload.id;
        return data;
      })
    );
  }

  obtenerVideosPorMateria(materia: Course) {
    const videosCollection = this.firestore.collection('videos', (ref) =>
      ref.where('course.id', '==', materia.id)
    );
    return videosCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Video;
          data.id = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  agregarVideo(video: Video) {
    return this.firestore.collection('videos').add(video);
  }

  actualizarVideo(video: Video) {
    return this.firestore.collection('videos').doc(video.id).update(video);
  }

  eliminarVideo(id: string): Promise<void> {
    return this.firestore.collection('videos').doc(id).delete();
  }
}
