import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario!: User;

  miFormulario: FormGroup = this.fb.group({
    'nombre': [ '' ],
    'email': [ '', [Validators.required, Validators.email] ],
    'password': ['', [Validators.required, Validators.minLength(6)] ],
  })

  constructor( private fb: FormBuilder,
               private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  register() {

    if( this.miFormulario.invalid ) {
      return;
    }

    this.usuario = this.miFormulario.value;
    
    this.authService.register(this.usuario);
      
    
  }

}
