import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ICarouselItem } from './Icarrousel-item.metadata';

@Component({
  selector: 'app-carrusel-img',
  standalone: true,
  imports: [],
  templateUrl: './carrusel-img.component.html',
  styleUrl: './carrusel-img.component.css'
})
export class CarruselImgComponent implements OnInit, OnDestroy  {

  @Input() height = 500;
  @Input() isFullScreen = false;
  items: ICarouselItem[]=[];
  @Input() imagenes: string[]=[];
  public finalHeight: string | number = 0;
  public currentPosition = 0;
  private intervalId: any;
  constructor(){
    this.finalHeight = this.isFullScreen ? '100vh' : `${this.height}px`;
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  ngOnInit(): void {
    this.generateItems();
    this.startAutoSlide(); 
  }
  generateItems(): void{
    this.items = this.imagenes.map((image, index) => ({
      id: index,
      image: image,
      marginLeft: 0
    }));
  }
  setCurrentPosition(position: number){
    this.currentPosition = position;
    const item =  this.items.find(i => i.id === 0);
    if(item){
      item.marginLeft = -100 * position;
    }
  }
  setNext(){
    let finalPercentage =0;
    let nextPosition = this.currentPosition + 1;
    if(nextPosition<= this.items.length -1){
      finalPercentage = -100 * nextPosition;
    }else{
      nextPosition = 0;
    }
    const item =  this.items.find(i => i.id === 0);
    if(item){
      item.marginLeft = finalPercentage;
    }
    this.currentPosition = nextPosition;
  }
  setBack(){
    let finalPercentage = 0;
    let backPosition = this.currentPosition - 1;
    if(backPosition >= 0){
      finalPercentage = -100 * backPosition;
    }else{
      backPosition = this.items.length - 1;
      finalPercentage = -100 * backPosition;
    }
    const item =  this.items.find(i => i.id === 0);
    if(item){
      item.marginLeft = finalPercentage;
    }
    this.currentPosition = backPosition;
  }
  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.setNext();
    }, 3000); // Cambia la imagen cada 3 segundos
  }
}
