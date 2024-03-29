import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { PaisesService } from 'src/app/services/paises.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario!: User;
  paises: string[] = [];
  ciudades: any[] = [];
  formSubmitted: boolean = false;

  miFormulario: UntypedFormGroup = this.fb.group({
    name: [ '', Validators.required ],
    email: [ '', [Validators.required, Validators.email] ],
    password: ['', [Validators.required, Validators.minLength(6)] ],
    password2: ['', [Validators.required] ],
    education_level: [ '', Validators.required ],
    institution: [ '', Validators.required ],
    country: [ '', Validators.required ],
    city: [ { value: '', disabled: this.ciudades.length === 0 }, Validators.required ],
    genre: [ '', Validators.required ],
    identification_card: [ '', Validators.required ]
  }, {
    validators: [ this.validator.camposIguales( 'password', 'password2' ) ]
  })
  
  constructor( private fb: UntypedFormBuilder,
               private authService: AuthService,
               private router: Router,
               private validator: ValidatorService,
               private paisesService: PaisesService
  ) { }

  ngOnInit(): void {

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
    return this.miFormulario.get(campo)?.invalid && this.formSubmitted;
  }

  register() {

    this.formSubmitted = true;

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.usuario = this.miFormulario.value;

    this.authService.register(this.usuario)
      .then( (userCredential: any)  => {
        delete this.usuario.password;
        delete this.usuario.password2;
        this.usuario.uid = userCredential.user.uid;
        this.authService.agregarUsuario( this.usuario ).then( () => {

          this.router.navigateByUrl('/play');

        }).catch( error => {
          console.log('Error al agregar el usuario:', error);
        });
      })
      .catch( error => {
        console.log('Error al registrar el usuario:', error);
      })
      
    
  }

}
