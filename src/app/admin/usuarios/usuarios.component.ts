import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  @ViewChild ('dt') dt: Table | undefined;

  usuarios: User[] = [];
  loading: boolean = true;
  scrollable: boolean = true;
  adminCheck: boolean = false;
  editorCheck: boolean = false;

  constructor( private adminService: AdminService,
               private authService: AuthService,
               private toastService: ToastrService,
               private observer: BreakpointObserver  
  ) { }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit(): void {

    this.adminService.obtenerUsuarios().subscribe( users => {
      this.authService.obtenerClaims().subscribe( res => {
        const uid = res?.claims['user_id'];
        this.usuarios = users.filter( user => user.uid != uid );
        this.loading = false;
      })
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(min-width: 1400px)']).subscribe((res) => {
        if (res.matches) {
          this.scrollable = false;
        } else {
          this.scrollable = true;
        }
      });
    }, 0)
  }

  agregarRolAdmin(event: any, email: string) {

    this.adminCheck = true;
    if( event.checked ){
      this.authService.agregarRolAdmin( email ).subscribe( ({msg}:any ) => {
        this.toastService.success(msg , 'Rol añadido')
        this.adminCheck = false; 
      });
    } else {
      this.authService.removerRolAdmin( email ).subscribe( ({msg}:any ) => {
        this.toastService.success(msg , 'Rol removido')
        this.adminCheck = false; 
      });
    }

  }

  agregarRolEditor(event: any, email: string) {

    this.editorCheck = true;
    if( event.checked ){
      this.authService.agregarRolEditor( email ).subscribe( ({msg}:any ) => {
        this.toastService.success(msg , 'Rol añadido')
        this.editorCheck = false; 
      });
    } else {
      this.authService.removerRolEditor( email ).subscribe( ({msg}:any ) => {
        this.toastService.success(msg , 'Rol removido')
        this.editorCheck = false; 
      });
    }

  }

}
