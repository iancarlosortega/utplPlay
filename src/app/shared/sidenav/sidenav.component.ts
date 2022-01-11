import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  panelOpenState = true;
  claims: any;
  admin: boolean = false;
  obs!: Subscription;

  menuItems: any = [];

  constructor( private authService: AuthService ) { }
  ngOnDestroy(): void {
    this.obs.unsubscribe();
  }

  ngOnInit(): void {

    this.obs = this.authService.obtenerClaims().subscribe( idTokenResult => {

      this.claims = idTokenResult?.claims;
      console.log(this.claims);
      if( this.claims.admin ){
        this.admin = true;
      };
      const menuItems = [
        {
          titulo: 'Administracion',
          subItems: [
            {
              subtitulo: 'Dashboard',
              route: './dashboard',
              icono: 'assessment',
              available: this.admin
            },
            {
              subtitulo: 'Gestion de roles',
              route: './usuarios',
              icono: 'supervised_user_circle',
              available: this.admin
            },
            {
              subtitulo: 'Carreras',
              route: './carreras',
              icono: 'data_usage',
              available: true
            },
            {
              subtitulo: 'Materias',
              route: './materias',
              icono: 'library_books',
              available: true
            },
          ]
        },
        {
          titulo: 'Videos',
          subItems: [
            {
              subtitulo: 'Subir video',
              route: './subir/videos',
              icono: 'ondemand_video',
              available: true
            },
            {
              subtitulo: 'Listado de videos',
              route: './videos',
              icono: 'video_library',
              available: true
            },
          ]
        },
        
      ];

      this.menuItems = menuItems;
    })

  }


}
