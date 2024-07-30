import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, Renderer2, ViewChild  } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { CartItemComponent } from './ui/cart-item/cart-item.component';
import { CartStateService } from '../data-access/cart-state.service';
import { ProductItemCart } from '../../admin/models/product.interface';
import { NavigationEnd, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import KRGlue from '@lyracom/embedded-form-glue';
import { PaymentService } from "../../admin/services/payment.service";
import { PedidoService } from '../../admin/services/pedido.service';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
declare const initFlowbite: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent, CurrencyPipe, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl:'./cart.component.css',
  styles: ``,
})
export default class CartComponent implements OnInit{
  @ViewChild('datos') divdatos!: ElementRef;
  @ViewChild('pagar') divpagar!: ElementRef;
  pedidoService = inject(PedidoService);
  state = inject(CartStateService).state;
  estadopayment = "CARRITO";
  TipoPago = "";
  formToken ="";
  message ="";
  data = {
    amount: this.state.price()*100,
    currency: 'PEN',
    orderId:  "myOrderId-999999",
    customer: {
        email: "",
        billingDetails:{
          firstName: "",
          lastName: "",
          cellPhoneNumber: "",
          address: "",
          district: "Ficus",
          city: "Santa Anita",
          state: "Lima",
          country: "PE",
          identityCode: "",
          identityType: "DNI"
          
        }
    }
  }
  private renderer: Renderer2;

  constructor(private router: Router,renderer: Renderer2, private paymentService: PaymentService,private chRef: ChangeDetectorRef,) {
    this.renderer = renderer;
  }
  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //Flowbite se inicia después de que se haya cargado la pagina
        setTimeout(() => initFlowbite(), 0);
      }
    });
      /*
    const script = this.renderer.createElement('script');
    script.src = 'https://sandbox-checkout.izipay.pe/payments/v1/js/index.js';
    script.async = true;
    this.renderer.appendChild(document.body, script);
    */
  }
  CompletarDatos(){
    this.estadopayment = "DATOS"
    this.divdatos.nativeElement.classList.add('activate');
  }

  ProcederPago(){
    this.estadopayment = "PAYMENT"
    this.divpagar.nativeElement.classList.add('activate');

  }
  ProcesoPagoTarjeta(){
    this.TipoPago = "TARJETA";
    const endpoint = "https://api.micuentaweb.pe";
    const publicKey = "80203493:testpublickey_2h74LTfgBCifM8NOXKuDkUqYUHMbb7jUegkAJqSUYYLgl";

    this.paymentService.postExternalData(this.data).subscribe(data =>{
      this.formToken =data.formToken;
      KRGlue.loadLibrary(endpoint, publicKey) // Load the remote library 
      .then(({ KR }) =>
        
        KR.setFormConfig({
           //set the minimal configuration 
          formToken: this.formToken,
          "kr-language": "es-ES"
          //to update initialization parameter 
        })
      )
      .then(({ KR }) =>
        KR.addForm("#myPaymentForm")
      ) // add a payment form  to myPaymentForm div
      .then(({ KR, result }) =>
        KR.showForm(result.formId)
      ).then(({ KR }) => KR.onSubmit(async paymentData => {
        this.paymentService.validatePayment(paymentData).subscribe(
          response => {
            if(response.Status){
              this.message = "pagado";
              this.RegistrarPedido();
              //KR.removeForms();
            }else{
              this.message = "no pagado"
            }
            this.chRef.detectChanges();
            
          },
          error => {
            this.message = 'PIPIPI';
          }
        );
        return true;
      })); //show the payment form 
    });
  }
  RegistrarPedido(){
    const pedido = {
      id:"",
      fecha: "",
      productos: JSON.stringify(this.state.products()),
      datospago: JSON.stringify(this.data),
      estado: "NUEVO"
    }
    console.log(pedido)
    this.pedidoService.registrar(pedido).subscribe();;
  }
  onRemove(id: string) {
    this.state.remove(id);
  }

  onIncrease(product: ProductItemCart) {
    this.state.udpate({
      product: product.product,
      quantity: product.quantity + 1,
    });
  }

  onDecrease(product: ProductItemCart) {
    this.state.udpate({
      ...product,
      quantity: product.quantity - 1,
    });
  }
}

