import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { switchMap } from 'rxjs';
import { Records } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  videos: Records[] = [];
  videosAux: Records[] = [];

  constructor( private authService: AuthService,
               private adminService: AdminService ) { }

  ngOnInit(): void {

    this.authService.obtenerClaims()
      .pipe(
        switchMap( idTokenResult => this.adminService.obtenerUsuarioPorId(idTokenResult?.claims['user_id']) )
      )
      .subscribe( user => {
        this.videosAux = user.search_history || [];
        this.videosAux = this.videosAux.reverse(); //Mostrar los más recientes
        this.videos = this.videosAux;
      });

  }

  buscar( event: any ){

    const value = event.target.value.trim().toLowerCase();
    this.videos = this.videosAux;
    this.videos = this.videos.filter( video => video.name.toLowerCase().includes(value) );

  }

}
