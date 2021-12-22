import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMateriaComponent } from './ver-materia.component';

describe('VerMateriaComponent', () => {
  let component: VerMateriaComponent;
  let fixture: ComponentFixture<VerMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerMateriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
