import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMateriasComponent } from './listado-materias.component';

describe('ListadoMateriasComponent', () => {
  let component: ListadoMateriasComponent;
  let fixture: ComponentFixture<ListadoMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoMateriasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
