import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map, Observable } from 'rxjs';
import { FileUpload } from '../admin/videos/models/file-upload-model';
import { Carrera, Materia, Video } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // Nombre de la carpeta donde se guardaran en el storage de firebase
  private basePath = '/videos';

  constructor( private firestore: AngularFirestore,
               private storage: AngularFireStorage
  ) { }

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

  // Materias
  
  obtenerMaterias(){
    const materiasCollection = this.firestore.collection('materias');

    return materiasCollection.snapshotChanges()
      .pipe(
        map(actions => {       
          return actions.map(a => {
            const data = a.payload.doc.data() as Materia;
            data.id = a.payload.doc.id;  
            return data
          });
        })
      )
  }

  obtenerMateriasVideos(){
    const materiasCollection = this.firestore.collection('materias');

    return materiasCollection.snapshotChanges()
      .pipe(
        map(actions => {       
          return actions.map(a => {
            const data = a.payload.doc.data() as Materia;
            data.id = a.payload.doc.id;  
            delete data.carreras;
            return data
          });
        })
      )
  }

  agregarMateria( materia: Materia ) {
    return this.firestore.collection('materias').add(materia);
  }

  getMateriaById(id: string) {
    return this.firestore.collection('materias').doc(id).snapshotChanges();
  }

  actualizarMateria(id: string, data: Materia ) {
    return this.firestore.collection('materias').doc(id).update( {
      nombre: data.nombre,
      carreras: data.carreras
    });
  }

  eliminarMateria( id: string ) {
    return this.firestore.collection('materias').doc(id).delete();
  }

  // Videos

  obtenerVideos(){
    const videosCollection = this.firestore.collection('videos');

    return videosCollection.snapshotChanges()
      .pipe(
        map(actions => {       
          return actions.map(a => {
            const data = a.payload.doc.data() as Video;
            data.id = a.payload.doc.id;  
            return data
          });
        })
      )
  }

  subirVideo(fileUpload: FileUpload, videoData: Video) {

    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
  
    //Esperar a obtener el link de descarga del archivo subido
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          videoData.url = downloadURL;
          this.agregarVideo(videoData);
        });
      })
    ).subscribe();
  
    return uploadTask.percentageChanges();
  }

  private agregarVideo(video: any) {
    this.firestore.collection('videos').add(video);
  }

  eliminarVideo(fileUpload: FileUpload): void {
    this.eliminarVideoFirestore(fileUpload.key)
      .then(() => {
        this.eliminarVideoStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private eliminarVideoFirestore(key: string): Promise<void> {
    return this.firestore.collection('videos').doc(key).delete()
  }

  private eliminarVideoStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }

}
