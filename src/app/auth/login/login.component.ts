import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    'email': [ '', [Validators.required, Validators.email] ],
    // 'email': [ 'juan@juan.com', [Validators.required, Validators.email] ],
    // 'email': [ 'icortega@utpl.edu.ec', [Validators.required, Validators.email] ],
    // 'password': [ '123456', [Validators.required, Validators.minLength(6)] ]
    'password': [ '', [Validators.required, Validators.minLength(6)] ]
  })

  constructor( private authService: AuthService ,
               private fb: FormBuilder,
               private router: Router
  ) { }

  ngOnInit(): void {
  }

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }

  login() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    const email = this.miFormulario.value.email;
    const password = this.miFormulario.value.password;

    this.authService.loginEmailPassword( email, password )
      .then( res => {
        console.log('Login exitoso', res);
        this.router.navigateByUrl('/play');

      }).catch( error => {
        console.log('Login error', error);
      })
  }

  loginGoogle() {
    this.authService.loginGoogle()
  }

  loginMicrosoft() {
    this.authService.loginMicrosoft()
  }

}
