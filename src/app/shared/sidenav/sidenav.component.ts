import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  panelOpenState = true;

  menuItems = [
    {
      titulo: 'Administracion',
      subItems: [
        {
          subtitulo: 'Dashboard',
          route: './dashboard',
          icono: 'assessment'
        },
        {
          subtitulo: 'Gestion de roles',
          route: './usuarios',
          icono: 'supervised_user_circle'
        },
        {
          subtitulo: 'Carreras',
          route: './carreras',
          icono: 'data_usage'
        },
        {
          subtitulo: 'Materias',
          route: './materias',
          icono: 'library_books'
        },
      ]
    },
    {
      titulo: 'Videos',
      subItems: [
        {
          subtitulo: 'Subir video',
          route: './subir/videos',
          icono: 'ondemand_video'
        },
        {
          subtitulo: 'Listado de videos',
          route: './videos',
          icono: 'video_library'
        },
      ]
    },
    
  ];

  constructor( private router: Router ) { }

  ngOnInit(): void {
  }

  navegarURL( ruta: string ) {
    this.router.navigateByUrl('./carreras');
  }

}
