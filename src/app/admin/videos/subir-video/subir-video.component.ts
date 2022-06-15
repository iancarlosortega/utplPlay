import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { map, switchMap, tap } from 'rxjs';
import { Career, CareerMin, Course, CourseMin, Video } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-subir-video',
  templateUrl: './subir-video.component.html',
  styleUrls: ['./subir-video.component.css']
})
export class SubirVideoComponent implements OnInit {

  @ViewChild(FormGroupDirective) formulario!: FormGroupDirective;
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;

  video!: Video;
  materias: CourseMin[] = [];
  materiasAux: any[] = [];
  carreras: CareerMin[] = [];
  carrerasAux: any[] = [];

  youtubeLinkRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

  miFormulario: FormGroup = this.fb.group({
    title: [ '', [ Validators.required, Validators.minLength(3) ] ],
    description: [ '', [ Validators.required, Validators.minLength(3) ] ],
    url: [ '', [ Validators.required, Validators.minLength(3), Validators.pattern(this.youtubeLinkRegExp) ] ],
    career: [ , [ Validators.required ] ],
    course: [{ value: '', disabled: this.materias.length === 0 } , [ Validators.required ] ],
  })

  constructor( private fb: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    
) { }

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1?.name === o2?.name && o1?.id === o2?.id;
  }

  ngOnInit(): void {

    this.adminService.obtenerCarreras().subscribe( carreras => {
      this.carreras = carreras.map( (career: Career) => {
        return {
          id: career.id,
          name: career.name,
          slug: career.slug,
        }
      })
      this.carrerasAux = this.carreras;
    });

    //Cargar las ciudades cuando elija un pais

    this.miFormulario.get('career')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('course')?.reset('');
          this.miFormulario.get('course')?.enable();
        }),
        switchMap( carrera => this.adminService.obtenerMateriasPorCarrera(carrera) ),
      )
      .subscribe( (materias: Course[]) => {
        this.materias = materias.map( (materia: Course) => {
          return {
            id: materia.id,
            name: materia.name,
            slug: materia.slug,
          }
        });
        this.materiasAux = this.materias;
      });

    if( !this.router.url.includes('editar') ) {
      return;
    }

    // Si la ruta es de editar traer la informacion segun su id para rellenar los campos del formulario
    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.adminService.obtenerVideoPorId(id) )
      )
      .subscribe( (video: Video) => {
        //Rellenar el formulario con la informacion obtenida
        this.video = video;
        this.miFormulario.reset({
          ...this.video
        });
      });

  }

  agregarVideo() {
    if( this.miFormulario.invalid ){
      this.miFormulario.markAllAsTouched();
      return;
    }

    if( this.video?.id ){

      // Actualizar Video
      this.video = {
        ...this.video,
        ...this.miFormulario.value,
      }

      this.adminService.actualizarVideo( this.video )
        .then( res => {
          this.toastr.info('El video fue actualizado con éxito', 'Video Actualizado');
          this.router.navigateByUrl('/admin/videos');
        })
        .catch( err => {
          console.log(err);
          this.toastr.error('Error al actualizar el video', 'Error');
        })


    } else {

      // Crear Video
      this.video = {
        ...this.miFormulario.value,
        publication_date: new Date()
      }
  
      this.adminService.agregarVideo( this.video )
        .then( res => {
          this.toastr.success('El video fue subido con éxito!', 'Video Subido');
          this.miFormulario.reset();
          this.formulario?.resetForm();
        })
        .catch( err => {
          console.log(err);
          this.toastr.error('Error al subir el video', 'Error');
        })

    }

  }
  
  filtrarMaterias($event: any) {
    let valor: string = $event.target.value.toLowerCase().trim();

    this.materias = this.materiasAux
    this.materias = this.materias.filter((materia: CourseMin) => {
      const nombreMateria = materia.name.toLowerCase();
      if( nombreMateria.includes(valor) ) {
        return true;
      } else {
        return false;
      }
    });
  }

  filtrarCarreras($event: any) {
    let valor: string = $event.target.value.toLowerCase().trim();

    this.carreras = this.carrerasAux
    this.carreras = this.carreras.filter((carrera: CareerMin) => {
      const nombreCarrera = carrera.name.toLowerCase();
      if( nombreCarrera.includes(valor) ) {
        return true;
      } else {
        return false;
      }
    });
  }

  limpiarBuscador() {
    this.txtBuscar.nativeElement.value = '';
    this.materias = this.materiasAux;
  }
}
