import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { Carrera } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-listado-carreras',
  templateUrl: './listado-carreras.component.html',
  styleUrls: ['./listado-carreras.component.css']
})
export class ListadoCarrerasComponent implements OnInit {

  @ViewChild ('dt') dt: Table | undefined;

  $: any;
  carreras: Carrera[] = [];
  carrera!: Carrera;
  loading: boolean = true;
  modalRef?: BsModalRef;

  miFormulario: FormGroup = this.fb.group({
    nombre: [ '', [ Validators.required, Validators.minLength(3) ] ],
    num_ciclos: [ '', [ Validators.required, Validators.min(1) ] ],
  })

  matcher = new MyErrorStateMatcher();

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  constructor( private adminService: AdminService, 
               private modalService: BsModalService,
               private fb: FormBuilder 
  ) { }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit(): void {

    this.adminService.obtenerCarreras().subscribe( res => {
      this.carreras = res;
      this.loading = false;
    });

  }

  agregarCarrera( formulario: any ) {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.carrera = this.miFormulario.value;

    this.adminService.agregarCarrera(this.carrera)
      .then( res => {
        // this.modalRef?.hide();
        this.miFormulario.reset();
        formulario.resetForm();
      })
      .catch( err => {
        console.log('Error al agregar la carrera', err);
      })

  }

}
