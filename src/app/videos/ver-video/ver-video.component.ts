import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Video } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-ver-video',
  templateUrl: './ver-video.component.html',
  styleUrls: ['./ver-video.component.css']
})
export class VerVideoComponent implements OnInit {

  video!: Video;
  videos!: Video[];

  constructor( private adminService: AdminService,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.adminService.obtenerVideoPorId(id) )
      )
      .subscribe( video => {
        this.video = video;
        this.adminService.obtenerVideosPorMateria(this.video.course).subscribe( videos => {
          this.videos = videos;
          this.videos = this.videos.filter( video => video.id != this.video.id );
        })
      });

  }

}
