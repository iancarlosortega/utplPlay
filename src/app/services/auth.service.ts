import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase from '@firebase/app-compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileUpload } from '../admin/models/file-upload-model';
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Nombre de la carpeta donde se guardaran en el storage de firebase
  private basePath = '/photos';

  constructor( private afAuth: AngularFireAuth,
               private firestore: AngularFirestore,
               private router: Router,
               private http: HttpClient,
               private storage: AngularFireStorage,
  ) {}

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

  loginFacebook() {
    const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    this.loginProvider( facebookAuthProvider );
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

  async loginProvider( provider: any ) {
    return this.afAuth.signInWithPopup( provider )
      .then( response => {
        
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

  agregarRolAdmin( email: string ) {
    return this.http.post(`${ environment.functionsURL }/api/addAdminRole`, { email });
  }

  removerRolAdmin( email: string ) {
    return this.http.post(`${ environment.functionsURL }/api/removeAdminRole`, { email });
  }

  agregarRolEditor( email: string ) {
    return this.http.post(`${ environment.functionsURL }/api/addEditorRole`, { email });
  }

  removerRolEditor( email: string ) {
    return this.http.post(`${ environment.functionsURL }/api/removeEditorRole`, { email });
  }

  obtenerClaims() {
    return this.afAuth.idTokenResult;
  }

  eliminarImagenStorage(name: string) {
    this.storage.ref(this.basePath).child(name).delete();
  }

}
