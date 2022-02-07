import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  year: number = new Date().getFullYear();

  contactos = [
    {
      icon: 'location_on',
      contacto: 'San Cayetano Alto - Loja'
    },
    {
      icon: 'markunread_mailbox',
      contacto: 'Buzón de consultas'
    },
    {
      icon: 'headset',
      contacto: '1800 88 75 88'
    },
    {
      icon: 'whatsapp',
      contacto: 'Whatsapp: 099 956 5400'
    },
    {
      icon: 'phone',
      contacto: 'PBX: 07 370 1444'
    },
  ];

  links = [
    {
      link: 'Carreras',
      route: '/play/carreras'
    },
    {
      link: 'Asignaturas',
      route: '/play/materias'
    },
    {
      link: 'Sobre Nosotros',
      route: '/play/nosotros'
    },
    {
      link: 'Proyecto Ascendere',
      route: ''
    },
    {
      link: 'UTPL',
      route: ''
    },
  ]


}
