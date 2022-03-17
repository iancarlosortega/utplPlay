import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { PaisesService } from 'src/app/services/paises.service';
import { FileUpload } from 'src/app/admin/models/file-upload-model';
import { User } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {

  usuario!: User;
  paises: string[] = [];
  ciudades: any[] = [];
  selectedFiles?: any;
  currentFileUpload?: FileUpload;
  url: any;
  format: string = '';
  percentage = 0;
  visible = true;

  miFormulario: FormGroup = this.fb.group({
    name: [ { value: '', disabled: false }, Validators.required ],
    education_level: [ { value: '', disabled: false }, Validators.required ],
    institution: [ { value: '', disabled: false }, Validators.required ],
    country: [ { value: '', disabled: false }, Validators.required ],
    city: [ { value: '', disabled: false }, Validators.required ],
    genre: [ { value: '', disabled: false }, Validators.required ],
    identification_card: [ { value: '', disabled: false }, Validators.required ],
    file: [ { value: '', disabled: false } ],
  })

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }

  constructor( private authService: AuthService,
               private adminService: AdminService,
               private paisesService: PaisesService,
               private toastr: ToastrService,
               private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.authService.obtenerClaims().subscribe( res => {

      const uid = res?.claims['user_id'];

      this.adminService.obtenerUsuarioPorId(uid).subscribe( (usuario: User) => {
        //Rellenar el formulario con la informacion obtenida
        this.usuario = usuario;
        this.format = 'image';
        this.url = usuario.photo_url;
        this.miFormulario.reset({
          ...this.usuario
        });
      })

    })

    this.paises = this.paisesService.obtenerPaises()

    //Cargar las ciudades cuando elija un pais

    this.miFormulario.get('country')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('city')?.reset('');
          this.miFormulario.get('city')?.enable();
        }),
        switchMap( pais => this.paisesService.obtenerCiudadesSegunPais(pais) )
      )
      .subscribe( (ciudades: any) => {
        this.ciudades = ciudades['data'];
      });

  }

  selectFile(event: any): void {

    const file = event.target.files && event.target.files[0];

    //Previsualizacion de la imagen
    if( file ) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      if(file.type.indexOf('image')> -1){
        this.selectedFiles = event.target.files;
        this.format = 'image';
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        }
      } else {
        this.selectedFiles = null;
        this.url = null;
        this.toastr.error('Por favor, solo subir archivos de formato imagen', 'Error')
      }
      
    } else {
      this.url = null;
      this.selectedFiles = null;
    }
  }

  actualizarPerfil() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.usuario = {...this.usuario, ...this.miFormulario.value};

    if (this.selectedFiles) {

      if(this.usuario.photo_filename) {
        this.authService.eliminarImagenStorage(this.usuario.photo_filename!)
      }

      let filename: string = this.miFormulario.controls['file'].value;
      filename = filename.split('\\').slice(-1)[0];
      this.usuario.photo_filename = filename;
      delete this.usuario.file;
      
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.disableForm();
        this.currentFileUpload = new FileUpload(file);
        this.authService.editarPerfil(this.currentFileUpload, this.usuario).subscribe( percentage => {
          this.percentage = Math.round(percentage ? percentage : 0);
          if( this.percentage == 100 ){
            setTimeout(() => {
              this.toastr.info('El perfil fue actualizado con éxito!', 'Perfil actualizado');
              this.enableForm();
              this.url = null;
              this.visible = false;
              this.percentage = 0;
            }, 500);
          }
        });
      } else {
        this.toastr.info('Warning', 'Aviso');
      }
    } else {
      delete this.usuario.file;
      this.authService.actualizarUsuario(this.usuario)
        .then( res => {
          this.toastr.info('El perfil fue actualizado con éxito!', 'Perfil actualizado');
        })
        .catch( err => {
          this.toastr.error('Error al actualizar el perfil', 'Error');
        })
    }

  }

  enableForm(): void {
    this.miFormulario.controls['name'].enable();
    this.miFormulario.controls['education_level'].enable();
    this.miFormulario.controls['country'].enable();
    this.miFormulario.controls['city'].enable();
    this.miFormulario.controls['genre'].enable();
    this.miFormulario.controls['identification_card'].enable();
    this.miFormulario.controls['institution'].enable();
    this.miFormulario.controls['file'].enable();
  }

  disableForm(): void {
    this.miFormulario.controls['name'].disable();
    this.miFormulario.controls['education_level'].disable();
    this.miFormulario.controls['country'].disable();
    this.miFormulario.controls['city'].disable();
    this.miFormulario.controls['genre'].disable();
    this.miFormulario.controls['identification_card'].disable();
    this.miFormulario.controls['institution'].disable();
    this.miFormulario.controls['file'].disable();
  }

}
