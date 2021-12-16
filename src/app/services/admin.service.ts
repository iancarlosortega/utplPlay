import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map } from 'rxjs';
import { FileUpload } from '../admin/models/file-upload-model';
import { Career, Course, Video } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // Nombre de la carpeta donde se guardaran en el storage de firebase
  private basePath = '/videos';

  constructor( private firestore: AngularFirestore,
               private storage: AngularFireStorage,
               private http: HttpClient
  ) { }

  // Usuarios

  obtenerUsuarios() {
    return this.firestore.collection('users').get();
  }

  // Carreras

  obtenerCarreras(){
    const carrerasCollection = this.firestore.collection('careers');

    return carrerasCollection.snapshotChanges()
      .pipe(
        map(actions => {       
          return actions.map(a => {
            const data = a.payload.doc.data() as Career;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      )
  }

  agregarCarrera( carrera: Career ) {
    return this.firestore.collection('careers').add(carrera);
  }

  getCarreraById(id: string) {
    return this.firestore.collection('careers').doc(id).snapshotChanges();
  }

  actualizarCarrera(id: string, data: Career ) {
    return this.firestore.collection('careers').doc(id).update( {
      name: data.name,
      duration: data.duration
    });
  }

  eliminarCarrera( id: string ) {
    return this.firestore.collection('careers').doc(id).delete();
  }

  // Materias
  
  obtenerMaterias(){
    const materiasCollection = this.firestore.collection('courses');

    return materiasCollection.snapshotChanges()
      .pipe(
        map(actions => {       
          return actions.map(a => {
            const data = a.payload.doc.data() as Course;
            data.id = a.payload.doc.id;  
            return data
          });
        })
      )
  }

  obtenerMateriasVideos(){
    const materiasCollection = this.firestore.collection('courses');

    return materiasCollection.snapshotChanges()
      .pipe(
        map(actions => {       
          return actions.map(a => {
            const data = a.payload.doc.data() as Course;
            data.id = a.payload.doc.id;  
            delete data.careers;
            return data
          });
        })
      )
  }

  agregarMateria( materia: Course ) {
    return this.firestore.collection('courses').add(materia);
  }

  getMateriaById(id: string) {
    return this.firestore.collection('courses').doc(id).snapshotChanges();
  }

  actualizarMateria(id: string, data: Course ) {
    return this.firestore.collection('courses').doc(id).update( {
      name: data.name,
      careers: data.careers
    });
  }

  eliminarMateria( id: string ) {
    return this.firestore.collection('courses').doc(id).delete();
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

  obtenerVideoPorId( id: string ){
    const video = this.firestore.collection('videos').doc(id);
    return video.snapshotChanges()
      .pipe(
        map(a => {       
          const data = a.payload.data() as Video;
            data.id = a.payload.id;  
            return data
        })
      )
  }

  subirVideo(fileUpload: FileUpload, videoData: Video, tipo: string) {

    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
  
    //Esperar a obtener el link de descarga del archivo subido
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          videoData.url = downloadURL;

          if( tipo === 'editar' ){
            this.actualizarVideo(videoData);
          } else {
            this.agregarVideo(videoData);
          }

        });
      })
    ).subscribe();
  
    return uploadTask.percentageChanges();
  }

  private agregarVideo(video: any) {
    this.firestore.collection('videos').add(video);
  }

  actualizarVideo(video: any) {
    return this.firestore.collection('videos').doc(video.id).update(video);
  }

  eliminarVideo(video: Video) {
    return this.eliminarVideoFirestore(video.id)
      .then(() => {
        this.eliminarVideoStorage(video.filename!);
      })
      .catch(error => console.log(error));
  }

  private eliminarVideoFirestore(id: string): Promise<void> {
    return this.firestore.collection('videos').doc(id).delete()
  }

  eliminarVideoStorage(name: string) {
    this.storage.ref(this.basePath).child(name).delete();
  }

}
