import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEntidadComponent } from './crear-entidad.component';

describe('CrearEntidadComponent', () => {
  let component: CrearEntidadComponent;
  let fixture: ComponentFixture<CrearEntidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEntidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
