import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { Records, Video } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-ver-video',
  templateUrl: './ver-video.component.html',
  styleUrls: ['./ver-video.component.css']
})
export class VerVideoComponent implements OnInit {

  video!: Video;
  videoHistorial: boolean = false;
  videoView: boolean = false;
  videos: Video[] = [];
  record!: Records;

  constructor( private adminService: AdminService,
               private activatedRoute: ActivatedRoute) { 

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

}
