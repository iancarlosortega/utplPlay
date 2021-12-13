import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Video } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';
import { EliminarComponent } from '../../eliminar/eliminar.component';

@Component({
  selector: 'app-listado-videos',
  templateUrl: './listado-videos.component.html',
  styleUrls: ['./listado-videos.component.css']
})
export class ListadoVideosComponent implements OnInit {

  @ViewChild ('dt') dt: Table | undefined;
  @ViewChild ('modalVideo') modalVideo!: TemplateRef<any>;

  id?: string;
  url: string = '';
  videos: Video[] = [];
  modalRef?: BsModalRef;
  loading: boolean = true;

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  openModal( url: string ) {
    this.url = url;
    this.modalRef = this.modalService.show(
      this.modalVideo,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  constructor( private modalService: BsModalService,
               private adminService: AdminService,
               private toastr: ToastrService,
               public  dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.modalService.onHidden.subscribe( (_) => {
      this.url = '';
    })

    this.adminService.obtenerVideos().subscribe( videos => {
      this.videos = videos;
      this.loading = false;
    });

  }

  eliminarVideo( video: Video ) {
    //Ventana modal para confirmar la eliminacion
    const dialog = this.dialog.open(EliminarComponent, {
      width: '400px'
    });

    dialog.afterClosed().subscribe( (result: any) => {
        if(result) {
          this.adminService.eliminarVideo(video)
          .then( (res: any) => {
            console.log(res);
            this.toastr.success('El video fue eliminado con éxito', 'Video eliminado!');
          })
          .catch( (err: any) => {
            this.toastr.error(`${err}`, 'Error al eliminar el video');
            console.log('Error al eliminar la carrera', err);
          })
        }
      }
    )    
  }

  descargarVideo( url: string ) {
    console.log(url);
  }

}
