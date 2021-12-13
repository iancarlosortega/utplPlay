import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit  {

  hidden: boolean = false;
  claims: any;

  ngOnInit(): void {

    if( this.router.url === '/play/home' ) {
      this.hidden = true;
    }

    this.authService.obtenerClaims().subscribe( idTokenResult => {
      const claims = idTokenResult?.claims;
      this.claims = claims;
      console.log('obtener claims',claims);
    });
    
  }

  constructor( private authService: AuthService,
               private router: Router
  ) {}

  logout() {
    this.authService.logout();
    console.log('logout');
  }

}
