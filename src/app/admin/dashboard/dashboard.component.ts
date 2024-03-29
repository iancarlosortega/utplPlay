import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { AdminService } from '../../services/admin.service';
import { Career, Course } from '../../interfaces/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  usuariosContador: number = 0;
  videosContador: number = 0;
  carrerasContador: number = 0;
  materiasContador: number = 0;

  carreras: Career[] = [];
  materias: Course[] = [];
  carrerasData: any;
  materiasData: any;

  constructor( private adminService: AdminService ) { }

  ngOnInit(): void {

    this.adminService.obtenerUsuarios().subscribe(res => {
      this.usuariosContador = res.length;
    })
    this.adminService.obtenerVideos().subscribe(videos => {
      this.videosContador = videos.length;
    })
    this.adminService.obtenerCarreras().subscribe(carreras => {
      this.carrerasContador = carreras.length;
      this.carreras = carreras.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice( 0,10 );
      this.carrerasData = {
        datasets: [
          {
            data: this.carreras.map( carrera => carrera.views ),
            label: 'Carreras Más Populares',
            backgroundColor: 'rgba(0,52,94,0.2)',
            borderColor: 'rgba(0,52,94,1)',
            pointBackgroundColor: 'rgba(0,52,94,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0,52,94,0.8)',
            fill: 'origin',
          }
        ],
        labels: this.carreras.map( carrera => carrera.name )
      };
    })
    this.adminService.obtenerMaterias().subscribe(materias => {
      this.materiasContador = materias.length;
      this.materias = materias.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice( 0,10 );
      this.materiasData = {
        datasets: [
          {
            data: this.materias.map( materia => materia.views ),
            label: 'Materias Más Populares',
            backgroundColor: 'rgba(0,52,94,0.2)',
            borderColor: 'rgba(0,52,94,1)',
            pointBackgroundColor: 'rgba(0,52,94,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0,52,94,0.8)',
            fill: 'origin',
          }
        ],
        labels: this.materias.map( materia => materia.name )
      };
    })

  }
}


