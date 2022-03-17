import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { Career, Course, Video } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {

  busqueda: string = '';
  videos: Video[] = [];
  videos_aux: Video[] = [];
  carreras: Career[] = [];
  carreras_aux: Career[] = [];
  asignaturas: Course[] = [];
  asignaturas_aux: Course[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private adminService: AdminService ) { }

  ngOnInit(): void {

    this.busqueda = this.activatedRoute.snapshot.params['id'];
    this.busqueda = this.busqueda.toLowerCase().trim();

    this.adminService.obtenerVideos().subscribe( videos => {
      this.videos = videos;
      this.videos_aux = videos.filter( video => video.title.toLowerCase().includes( this.busqueda ) );
    })
    this.adminService.obtenerCarreras().subscribe( carreras => {
      this.carreras = carreras;
      this.carreras_aux = carreras.filter( carrera => carrera.name.toLowerCase().includes( this.busqueda ) );
    })
    this.adminService.obtenerMaterias().subscribe( asignaturas => {
      this.asignaturas = asignaturas;
      this.asignaturas_aux = asignaturas.filter( asignatura => asignatura.name.toLowerCase().includes( this.busqueda ) || asignatura.keywords?.includes( this.busqueda ));
    })

  }

  buscar(event: any) {

    const value = event.target.value.toLowerCase().trim();
    this.videos_aux = this.videos.filter( video => video.title.toLowerCase().includes(value) );
    this.carreras_aux = this.carreras.filter( carrera => carrera.name.toLowerCase().includes(value) );
    this.asignaturas_aux = this.asignaturas.filter( asignatura => asignatura.name.toLowerCase().includes(value) || asignatura.keywords?.includes(value));

  }

}
