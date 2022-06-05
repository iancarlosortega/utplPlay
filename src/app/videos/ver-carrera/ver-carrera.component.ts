import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { switchMap } from 'rxjs';
import { Career, Course } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-ver-carrera',
  templateUrl: './ver-carrera.component.html',
  styleUrls: ['./ver-carrera.component.css']
})
export class VerCarreraComponent implements OnInit {

  carrera!: Career;
  materias: Course[] = [];
  carrerasRelacionadas!: Career[];
  loading: boolean = true;

  constructor( private activatedRoute: ActivatedRoute,
               private adminService: AdminService  
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(
        switchMap( ({slug}) => this.adminService.obtenerCarreraPorSlug(slug) ),
      )
      .subscribe( carrera => {
        this.carrera = carrera[0];
        this.agregarVisualizacion(this.carrera.id);
        this.adminService.obtenerMateriasPorCarrera(carrera[0]).subscribe( materias => {
          this.materias = materias;
          this.loading = false;
        });
        this.adminService.obtenerCarrerasPorArea(this.carrera.area).subscribe( carreras => {
          this.carrerasRelacionadas = carreras.filter( carrera => carrera.id != this.carrera.id )
        })
      });

  }

  agregarVisualizacion(id: string) {
    this.adminService.agregarVisualizacionCarrera(id).subscribe( res => {
      console.log(res);
    })
  }

}
