import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { Table } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';
import { EliminarComponent } from '../../eliminar/eliminar.component';
import { Video } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-listado-videos',
  templateUrl: './listado-videos.component.html',
  styleUrls: ['./listado-videos.component.css'],
})
export class ListadoVideosComponent implements OnInit, AfterViewInit {
  @ViewChild('dt') dt: Table | undefined;
  @ViewChild('modalVideo') modalVideo!: TemplateRef<any>;

  id?: string;
  url: string = '';
  videos: Video[] = [];
  modalRef?: BsModalRef;
  loading: boolean = true;
  scrollable: boolean = true;

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  openModal(url: string) {
    this.url = url;
    this.modalRef = this.modalService.show(
      this.modalVideo,
      Object.assign({}, { class: 'modal-lg' })
    );
  }

  constructor(
    private modalService: BsModalService,
    private adminService: AdminService,
    private observer: BreakpointObserver,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.modalService.onHidden.subscribe((_) => {
      this.url = '';
    });

    this.adminService.obtenerVideos().subscribe((videos) => {
      this.videos = videos;
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(min-width: 1500px)']).subscribe((res) => {
        if (res.matches) {
          this.scrollable = false;
        } else {
          this.scrollable = true;
        }
      });
    }, 0);
  }

  eliminarVideo(video: Video) {
    //Ventana modal para confirmar la eliminacion
    const dialog = this.dialog.open(EliminarComponent, {
      width: '400px',
    });

    dialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.adminService
          .eliminarVideo(video.id)
          .then((res: any) => {
            console.log(res);
            this.toastr.success(
              'El video fue eliminado con éxito',
              'Video eliminado!'
            );
          })
          .catch((err: any) => {
            this.toastr.error(`${err}`, 'Error al eliminar el video');
            console.log('Error al eliminar la carrera', err);
          });
      }
    });
  }
}
