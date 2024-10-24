import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCotizacionComponent } from './list-cotizacion.component';

describe('ListCotizacionComponent', () => {
  let component: ListCotizacionComponent;
  let fixture: ComponentFixture<ListCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCotizacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
