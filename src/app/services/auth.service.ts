import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Router } from '@angular/router';
import { User } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';
import firebase from '@firebase/app-compat';
import { FileUpload } from '../admin/models/file-upload-model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Nombre de la carpeta donde se guardaran en el storage de firebase
  private basePath = '/photos';

  //TODO: Cambiar las reglas de leer, escribir del firestore a futuro en produccion.

  constructor( private afAuth: AngularFireAuth,
               private firestore: AngularFirestore,
               private functions: AngularFireFunctions,
               private router: Router,
               private http: HttpClient,
               private storage: AngularFireStorage,
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
    this.loginProvider( googleAuthProvider );
  }

  loginMicrosoft() {
    const microsoftAuthProvider = new firebase.auth.OAuthProvider("microsoft.com");

    microsoftAuthProvider.setCustomParameters({
      tenant: '6eeb49aa-436d-43e6-becd-bbdf79e5077d'
    });
    microsoftAuthProvider.addScope("user.read");
    microsoftAuthProvider.addScope("openid");
    microsoftAuthProvider.addScope("profile");
    microsoftAuthProvider.addScope("mail.send");
    this.loginProvider(microsoftAuthProvider);
  }

  loginProvider( provider: any ) {
    return this.afAuth.signInWithPopup( provider )
      .then( response => {
        
        // this.router.navigate([ 'auth/register/', 123 ])
        if(response.additionalUserInfo?.isNewUser === true) {

          const usuario: User = {
            uid: response.user?.uid!,
            name: response.user?.displayName!,
            email: response.user?.email!,
            photo_url: response.user?.photoURL!
          }

          this.agregarUsuario(usuario)
            .then( res => {
              console.log('Usuario agregado', res);
              this.router.navigate([ 'auth/register/', usuario.uid ])
            })
            .catch( err => {
              console.log('Error agregar usuario', err);
            })

        } else {
          this.router.navigateByUrl('/play')
        }

      })
      .catch( err => {
        console.log(err);
      })
  }

  async logout() {
    await this.afAuth.signOut();
  }

  agregarUsuario( usuario: User ) {
    return this.firestore.collection('users').doc( usuario.uid ).set( usuario );
  }

  editarPerfil(fileUpload: FileUpload, usuarioData: User) {

    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
  
    //Esperar a obtener el link de descarga del archivo subido
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          usuarioData.photo_url = downloadURL;
          this.actualizarUsuario(usuarioData);
        });
      })
    ).subscribe();
  
    return uploadTask.percentageChanges();
  }

  actualizarUsuario( usuario: User ) {
    return this.firestore.collection('users').doc(usuario.uid).update(usuario);
  }
  //TODO: Agregar con el plan avanzado de firebase con Cloud Functions
  // agregarRolAdmin( email: string ) {
  //   return this.http.post(`${ environment.baseURL }/api/addAdminRole`, { email });
  // }

  obtenerClaims() {
    return this.afAuth.idTokenResult;
  }

  eliminarImagenStorage(name: string) {
    this.storage.ref(this.basePath).child(name).delete();
  }

}
