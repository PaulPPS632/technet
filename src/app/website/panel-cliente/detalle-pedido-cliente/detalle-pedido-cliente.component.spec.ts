import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePedidoClienteComponent } from './detalle-pedido-cliente.component';

describe('DetallePedidoClienteComponent', () => {
  let component: DetallePedidoClienteComponent;
  let fixture: ComponentFixture<DetallePedidoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePedidoClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallePedidoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
