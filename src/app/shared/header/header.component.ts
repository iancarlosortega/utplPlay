import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  obs!: Subscription;
  visibleSidebar: boolean = false;
  toolBar: boolean = false;
  hidden: boolean = false;
  claims: any;

  menuItems = [
    {
      titulo: 'Home',
      route: '/play/home',
      icono: 'home'
    },
    {
      titulo: 'Carreras',
      route: '/play/carreras',
      icono: 'data_usage'
    },
    {
      titulo: 'Asignaturas',
      route: '/play/materias',
      icono: 'library_books'
    },
    {
      titulo: 'Historial',
      route: '/play/historial',
      icono: 'history'
    },
    {
      titulo: 'Editar Perfil',
      route: '/play/perfil',
      icono: 'account_box'
    },
    {
      titulo: 'Sobre Nosotros',
      route: '/play/nosotros',
      icono: 'supervised_user_circle'
    }
  ];


  constructor( private authService: AuthService,
               private router: Router,
               private observer: BreakpointObserver
  ) {}
  ngOnDestroy(): void {
    this.obs.unsubscribe();
  }

  ngOnInit(): void {

    if( this.router.url === '/play/home' ) {
      this.hidden = true;
    }

    this.obs = this.authService.obtenerClaims().subscribe( idTokenResult => {
      const claims = idTokenResult?.claims;
      this.claims = claims;
    });
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(min-width: 768px)']).subscribe((res) => {
        if (res.matches) {
          this.toolBar = false;
        } else {
          this.toolBar = true;
        }
      });
    }, 0)
  }

  logout() {
    this.authService.logout();
  }

}
