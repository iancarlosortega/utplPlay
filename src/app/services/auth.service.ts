import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Router } from '@angular/router';
import { User } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';
import firebase from '@firebase/app-compat';

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

  // AuthLogin(provider, path, dataProvider: any) {
  //   return this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then((result) => {
  //       this.ngZone.run(async () => {
  //         this.userAuth = result.additionalUserInfo.profile as User, getCircularReplacer();
          
  //         if (result.additionalUserInfo.isNewUser === false) {
  //           const userCollection = await this.userService.getTeacher(result.user.uid)
  //           userCollection.subscribe(user => {
  //             this.userAuth = user.data() as User, getCircularReplacer();
  //             this.userService.getTeacherProfile(this.userAuth.mail).subscribe(userProfile => {
  //               const profile = userProfile as UserProfile;
  //               if (
  //                 profile == undefined ||
  //                 profile.area == undefined ||
  //                 profile.section == undefined ||
  //                 profile.department == undefined ||
  //                 profile.ci == undefined
  //               ) {
  //                 this.getDataUserUTPL(this.userAuth.mail).then(data => {
  //                   data.subscribe(user => {
  //                     const userRRHH = user.result.items[0] as UserRRHH;
  //                     this.userService.addUserProfile({
  //                       ci: userRRHH.identificacion,
  //                     })
  //                   })
  //                 })

  //                 const dialogRef = this.dialog.open(UpdateProfileComponent, {
  //                   width: '60vw',
  //                   height: '60vh',
  //                   data: this.userAuth,
  //                 });

  //               } else
  //                 if (
  //                   this.userAuth.role === "Teacher" ||
  //                   this.userAuth.role === "Administrative" ||
  //                   this.userAuth.role === "Review-project" ||
  //                   this.userAuth.role === "Root"
  //                 ) {
  //                   if (path == 'sign-in') {
  //                     return this.router.navigate(["portal"]);
  //                   }
  //                   if (path == 'portal') {
  //                     return this.router.navigate(["portal"]);
  //                   }
  //                   if (path == 'tools') {
  //                     return this.router.navigate(["portal"]);
  //                   }
  //                   if (path == 'postulate') {
  //                     this.router.navigate(['/portal/innovation/postulate']);

  //                   } if (path == 'survey') {
  //                     window.location.reload();
  //                   }
  //                   if (path == 'training') {
  //                     /* Swal.fire({
  //                       title: '⚠️ Mantenimiento ⚠️ ',
  //                       text: 'La plataforma se encuentra en mantenimiento, por favor intentar el día martes 6 de abril.',
  //                       icon: 'error',
  //                       confirmButtonText: 'Aceptar'
  //                     }) */
  //                     this.inscriptionCourse(this.userAuth.mail || this.userAuth.email, dataProvider)
  //                   }

  //                 }
  //             })
  //           })
  //         } else if (result.additionalUserInfo.isNewUser === true) {
  //           if (result.additionalUserInfo.profile["jobTitle"] === null) {
  //             this.SetUserData(result, "Student");
  //           } else if (
  //             result.additionalUserInfo.profile["jobTitle"].includes("Docente") ||
  //             result.additionalUserInfo.profile["jobTitle"].includes("DOCENTE")
  //           ) {
  //             this.SetUserData(result, "Teacher");
  //           } else if (result.additionalUserInfo.profile["jobTitle"]) {
  //             this.SetUserData(result, "Administrative");
  //           }
  //         }

  //       });
  //     })
  // }

  async logout() {
    await this.afAuth.signOut();
  }

  agregarUsuario( usuario: User ) {
    return this.firestore.collection('users').doc( usuario.uid ).set( usuario );
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

}
