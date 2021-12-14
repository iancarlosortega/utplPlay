import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Table } from 'primeng/table';
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

  constructor( private adminService: AdminService,
               private observer: BreakpointObserver  
  ) { }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  ngOnInit(): void {

    this.adminService.obtenerUsuarios().subscribe( res => {
      res.docs.forEach((element: any) => {
        this.usuarios.push(element.data())
      });
      this.loading = false;
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(min-width: 1140px)']).subscribe((res) => {
        if (res.matches) {
          this.scrollable = false;
        } else {
          this.scrollable = true;
        }
      });
    }, 0)
  }

  prueba(value: any) {
    console.log('prueba check box', value);
  }

}
