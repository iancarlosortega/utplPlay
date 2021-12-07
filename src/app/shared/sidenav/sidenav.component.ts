import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
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
      ]
    },
    {
      titulo: 'Carreras',
      subItems: [
        {
          subtitulo: 'Agregar carrera',
          route: './agregar/carrera',
          icono: 'playlist_add'
        },
        {
          subtitulo: 'Listado de carreras',
          route: './carreras',
          icono: 'list_alt'
        },
      ]
    },
    {
      titulo: 'Materias',
      subItems: [
        {
          subtitulo: 'Agregar materia',
          route: './agregar/materia',
          icono: 'note_add'
        },
        {
          subtitulo: 'Listado de materias',
          route: './materias',
          icono: 'format_list_bulleted'
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
