import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, Renderer2, ViewChild  } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { CartItemComponent } from './ui/cart-item/cart-item.component';
import { CartStateService } from '../data-access/cart-state.service';
import { ProductItemCart } from '../interfaces/product.interface';
import { NavigationEnd, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import KRGlue from '@lyracom/embedded-form-glue';
import { PaymentService } from "../../admin/services/payment.service";
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
    const iziConfig = {
      config: {
        transactionId: '{TRANSACTION_ID}',
        action: 'pay',
        merchantCode: '{MERCHANT_CODE}',
        order: {
          orderNumber: '{ORDER_NUMBER}',
          currency: 'PEN',
          amount: '1.50',
          processType: 'AT',
          merchantBuyerId: '{MERCHANT_CODE}',
          dateTimeTransaction: '1670258741603000',
        },
        billing: {
          firstName: 'Juan',
          lastName: 'Wick Quispe',
          email: 'jwickq@izi.com',
          phoneNumber: '958745896',
          street: 'Av. Jorge Chávez 275',
          city: 'Lima',
          state: 'Lima',
          country: 'PE',
          postalCode: '15038',
          documentType: 'DNI',
          document: '21458796',
        }
      },
    };

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
              KR.removeForms();
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

