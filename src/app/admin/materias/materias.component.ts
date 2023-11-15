import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { Table } from 'primeng/table';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { Course, CareerMin, Career } from 'src/app/interfaces/interfaces';
import { stringToSlug } from '../../utils/stringToSlug';
@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit, AfterViewInit {

  @ViewChild ('dt') dt: Table | undefined;
  @ViewChild( FormGroupDirective ) formulario!: FormGroupDirective;
  @ViewChild ('modalCrear') modalCrear!: TemplateRef<any>;
  @ViewChild ('modalEditar') modalEditar!: TemplateRef<any>;

  id?: string;
  carreras: CareerMin[] = [];
  materias: Course[] = [];
  materia!: Course;
  loading: boolean = true;
  disabled: boolean = false;
  scrollable: boolean = true;
  modalRef?: BsModalRef;
  emptyMessage: string = 'Ninguna carrera encontrada'

  miFormulario: UntypedFormGroup = this.fb.group({
    name: [ '', [ Validators.required, Validators.minLength(3) ] ],
    description: [ '', [ Validators.required, Validators.minLength(10) ] ],
    keywords: [ '', [ Validators.required ] ],
    purposes: [ '' ],
    careers: [ '', [ Validators.required ] ],
  })
 
  openModal() {
    this.modalRef = this.modalService.show(this.modalCrear);
  }

  openModalEditar() {
    this.modalRef = this.modalService.show(this.modalEditar);
  }

  closeModal() {
    this.modalRef?.hide();
    this.miFormulario.reset();
    this.formulario?.resetForm();
  }  

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  constructor( private fb: UntypedFormBuilder ,
               private adminService: AdminService, 
               private modalService: BsModalService,
               private toastr: ToastrService,
               private observer: BreakpointObserver,
               public  dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.modalService.onHidden.subscribe( (_)=> {
      this.miFormulario.reset();
      this.formulario?.resetForm();
    })

    this.adminService.obtenerMaterias().subscribe( materias => {
      this.materias = materias;
      this.loading = false;
    });

    this.adminService.obtenerCarreras().subscribe( carreras => {
      this.carreras = carreras.map( (career: Career) => {
        return {
          id: career.id,
          name: career.name,
          slug: career.slug,
        }
      })
    })

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(min-width: 1400px)']).subscribe((res) => {
        if (res.matches) {
          this.scrollable = false;
        } else {
          this.scrollable = true;
        }
      });
    }, 0)
  }

  agregarMateria() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      this.miFormulario.controls['careers'].markAsDirty();
      return;
    }

    this.materia = this.miFormulario.value;
    this.materia.views = 0;
    this.materia.slug = stringToSlug(this.materia.name);

    this.disabled = true;
    this.adminService.agregarMateria(this.materia)
      .then( res => {
        this.modalRef?.hide();
        this.disabled = false;
        this.miFormulario.reset();
        this.formulario?.resetForm();
        this.toastr.success(`La carrera ${this.materia.name} fue registrada con éxito!`, 'Materia Registrada');
      })
      .catch( err => {
        this.toastr.error(`${err}`, 'Error al agregar la materia');
        console.log('Error al agregar la materia', err);
      })

  }

  obtenerMateria(id: string) {
    this.openModalEditar();
    this.adminService.obtenerMateriaPorId(id).subscribe( (data: any) => {
      if( data.type != 'removed' ) {
        this.materia = data;
        this.miFormulario.setValue({
          name: data.name,
          description: data.description || '',
          keywords: data.keywords || '',
          purposes: data.purposes || '',
          careers: data.careers,
        });
      }
      
    })
  }

  actualizarMateria() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.materia = {
      ...this.materia, 
      slug: stringToSlug(this.miFormulario.value.name),
      ...this.miFormulario.value
    };

    this.disabled = true;
    this.adminService.actualizarMateria( this.materia )
      .then( res => {
        this.modalRef?.hide();
        this.disabled = false;
        this.miFormulario.reset();
        this.formulario?.resetForm();
        this.toastr.info(`La materia ${this.materia.name} fue actualizada con éxito`, 'Materia actualizada!');
      })
      .catch( err => {
        this.toastr.error(`${err}`, 'Error al actualizar la materia');
        console.log('Error al actualizar la materia', err);
      })
  }

  eliminarMateria( id: string ) {
    //Ventana modal para confirmar la eliminacion
    const dialog = this.dialog.open(EliminarComponent, {
      width: '400px'
    });

    dialog.afterClosed().subscribe( (result) => {
        if(result) {
          this.adminService.eliminarMateria(id)
          .then( res => {
            console.log(res);
            this.toastr.success('La materia fue eliminada con éxito', 'Materia eliminada!');
          })
          .catch( err => {
            this.toastr.error(`${err}`, 'Error al eliminar la materia');
            console.log('Error al eliminar la materia', err);
          })
        }
      }
    )

    
  }

}
