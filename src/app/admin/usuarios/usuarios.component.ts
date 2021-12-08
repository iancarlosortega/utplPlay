import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { User } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  @ViewChild ('dt2') dt2: Table | undefined;

  usuarios: User[] = [];
  loading: boolean = true;
  selectedRow: any;
  checked: boolean = true

  constructor( private adminService: AdminService ) { }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onRowSelect( rowInfo: any ) {
    console.log(rowInfo);
  }

  ngOnInit(): void {

    this.adminService.obtenerUsuarios().subscribe( res => {
      res.docs.forEach((element: any) => {
        this.usuarios.push(element.data())
      });
      this.loading = false;
      console.log(this.usuarios);
    });

  }

  prueba(value: any) {
    console.log('prueba check box', value);
  }

}