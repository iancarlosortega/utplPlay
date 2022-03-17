import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string = '';

  constructor( private authService: AuthService,
               private adminService: AdminService ) { }

  ngOnInit(): void {

    this.authService.obtenerClaims()
      .pipe(
        switchMap( idTokenResult => this.adminService.obtenerUsuarioPorId(idTokenResult?.claims['user_id']) )
      )
      .subscribe( ({name}) => {
        this.username = name!;
      })

  }
}
