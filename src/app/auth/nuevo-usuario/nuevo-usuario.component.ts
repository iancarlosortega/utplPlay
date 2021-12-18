import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { User } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { PaisesService } from 'src/app/services/paises.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {

  usuario!: User;
  paises: string[] = [];
  ciudades: any[] = [];


  //TODO: Validaciones de confirmar contrasenia, cedula y selects 

  miFormulario: FormGroup = this.fb.group({
    education_level: [ '', Validators.required ],
    institution: [ '', Validators.required ],
    country: [ '', Validators.required ],
    city: [ { value: '', disabled: this.ciudades.length === 0 }, Validators.required ],
    genre: [ '', Validators.required ],
    identification_card: [ '', Validators.required ]
  })
  
  constructor( private fb: FormBuilder,
               private adminService: AdminService,
               private authService: AuthService,
               private router: Router,
               private paisesService: PaisesService,
               private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.adminService.obtenerUsuarioPorId(id) )
      )
      .subscribe( (usuario: User) => {
        console.log('hey',usuario);
        if(usuario == null) {
          this.router.navigateByUrl('auth/login');
        } else {
          this.usuario = usuario;
        }

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

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }

  register() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.usuario = {...this.usuario,...this.miFormulario.value};     
    
    this.authService.actualizarUsuario(this.usuario)
      .then( res => {
        console.log('Usuario actualizado',res);
        this.router.navigateByUrl('/play');
      })
      .catch( err => {
        console.log('Error', err);
      })
  }

}
