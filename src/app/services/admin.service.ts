import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map } from 'rxjs';
import { FileUpload } from '../admin/models/file-upload-model';
import { Area, Career, Course, User, Video } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // Nombre de la carpeta donde se guardaran en el storage de firebase
  private basePath = '/videos';
  private basePathCarreras = '/careers';

  constructor( private firestore: AngularFirestore,
               private storage: AngularFireStorage,
               private http: HttpClient
  ) { }

  // Usuarios

  obtenerUsuarios() {
    return this.firestore.collection('users').get();
  }

  obtenerUsuarioPorId(id: string) {
    const usuario = this.firestore.collection('users').doc(id);
    return usuario.snapshotChanges()
      .pipe(
        map(a => {       
          const data = a.payload.data() as User;
            data.uid = a.payload.id;  
            return data
        })
      )
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

  obtenerCarreraPorId(id: string) {
    const carrera = this.firestore.collection('careers').doc(id);
    return carrera.snapshotChanges()
      .pipe(
        map(a => {       
          const data = a.payload.data() as Career;
          data.id = a.payload.id;  
          return data
        })
      )
  }

  obtenerCarrerasPorArea(area: Area){


    const carrerasCollection = this.firestore.collection('careers', ref => ref.where('area', '==' , area));

    return carrerasCollection.snapshotChanges()
      .pipe(
        map(actions => {       
          return actions.map(a => {
            const data = a.payload.doc.data() as Career;
            data.id = a.payload.doc.id;  
            return data
          });
        })
      )
  }

  agregarCarrera(fileUpload: FileUpload, carreraData: Career, tipo: string) {

    const filePath = `${this.basePathCarreras}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
  
    //Esperar a obtener el link de descarga del archivo subido
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          carreraData.photo_url = downloadURL;

          if( tipo === 'editar' ){
            this.actualizarCarrera(carreraData);
          } else {
            this._agregarCarrera(carreraData);
          }

        });
      })
    ).subscribe();
  
    return uploadTask.percentageChanges();
  }

  private _agregarCarrera( carrera: Career ) {
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
      .catch(error => console.log(error));
  }

  private eliminarCarreraFirestore(id: string): Promise<void> {
    return this.firestore.collection('careers').doc(id).delete()
  }

  eliminarCarreraStorage(name: string) {
    this.storage.ref(this.basePathCarreras).child(name).delete();
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

  obtenerMateriasPorCarrera(carrera: Career){

    const materiasCollection = this.firestore.collection('courses', ref => ref.where('careers', 'array-contains' , carrera));

    return materiasCollection.snapshotChanges()
      .pipe(
        map(actions => {       
          return actions.map(a => {
            const data = a.payload.doc.data() as Course;
            data.id = a.payload.doc.id;  
            const {careers, keywords, purposes, ...materia} = data
            return materia;
          });
        })
      )
  }

  agregarMateria( materia: Course ) {
    return this.firestore.collection('courses').add(materia);
  }

  obtenerMateriaPorId(id: string) {
    const carrera = this.firestore.collection('courses').doc(id);
    return carrera.snapshotChanges()
      .pipe(
        map(a => {       
          const data = a.payload.data() as Course;
          data.id = a.payload.id;  
          return data
        })
      )
  }

  actualizarMateria(data: Course ) {
    return this.firestore.collection('courses').doc(data.id).update( data );
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

  obtenerVideosPorMateria(materia: Course){

    console.log(materia);

    const videosCollection = this.firestore.collection('videos', ref => ref.where('course.id', '==' , materia.id));

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
