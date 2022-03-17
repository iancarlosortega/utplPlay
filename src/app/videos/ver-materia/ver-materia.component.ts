import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { switchMap } from 'rxjs';
import { Course, Video } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-ver-materia',
  templateUrl: './ver-materia.component.html',
  styleUrls: ['./ver-materia.component.css']
})
export class VerMateriaComponent implements OnInit {

  materia!: Course;
  videos: Video[] = [];

  constructor( private adminService: AdminService,
               private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.adminService.obtenerMateriaPorId(id) )
      )
      .subscribe( materia => {
        this.materia = materia;
        this.adminService.obtenerVideosPorMateria(this.materia).subscribe( videos => {
          this.videos = videos;
        })
      });

  }

}
