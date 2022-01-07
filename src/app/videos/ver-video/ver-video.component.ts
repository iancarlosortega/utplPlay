import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Records, Video } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ver-video',
  templateUrl: './ver-video.component.html',
  styleUrls: ['./ver-video.component.css']
})
export class VerVideoComponent implements OnInit {


  video!: Video;
  played: boolean = false;
  videos!: Video[];
  record!: Records;

  constructor( private adminService: AdminService,
               private activatedRoute: ActivatedRoute,
               private authService: AuthService,
               private router: Router ) { 

  }

  ngOnInit() {

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.adminService.obtenerVideoPorId(id) ),
        tap( video => {
          this.video = video;
          this.record = {
            id: this.video.id,
            name: this.video.title
          }
        }),
        switchMap( video => this.adminService.obtenerVideosPorMateria(video.course) )
      )
      .subscribe(videos => {
          this.videos = videos;
          this.videos = this.videos.filter( video => video.id != this.video.id );
        }
      )

  }

  cambiarVideo( id: string ){
    this.router.navigate(['/play/video', id]);
    this.played = false;
  }
  
  historial(event: any){
    const currentTime = event.target.currentTime;
    if ( currentTime > 1) {

      if( !this.played ){

        this.authService.obtenerClaims().subscribe( res => {

          const uid = res?.claims['user_id'];
          this.adminService.actualizarHistorialUsuario(uid, this.record);
    
        })
      } 
      this.played = true;   
    };    
  }

}
