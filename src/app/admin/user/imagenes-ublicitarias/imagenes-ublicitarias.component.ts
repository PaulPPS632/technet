import { Component, OnInit } from '@angular/core';
import { ArchivosService } from '../../services/archivos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

declare const initFlowbite: any;

@Component({
  selector: 'app-imagenes-ublicitarias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imagenes-ublicitarias.component.html'
})
export class ImagenesUblicitariasComponent implements OnInit{

  constructor(
    private router: Router,
    private archivosService: ArchivosService,
    private modalService: NgbModal)
  {}


  selectedTipo = "";
  imagenescargadas : string[] = [];
  selectedFiles : File[]=[];
  archivosAgrupados: Record<string, string[]> = {};

  CreateOpen = false;

  openCModal() {
    this.CreateOpen = true;
  }

  ngOnInit(): void {


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        //Flowbite se inicia después de que se haya cargado la pagina
        setTimeout(() => initFlowbite(), 0);
      }
    });

    this.cargarimagenes();
  }

  cargarimagenes(){
    this.archivosService.getImagenesPublicitarias().subscribe(
      data => {
        this.archivosAgrupados = data;
      }
    );
  }

  guardarimagenes() {

    const formData = new FormData();
    formData.append('tipo', this.selectedTipo);
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    this.archivosService.postarchivo(formData).subscribe({
      next: () => {
        //actualizar productos
        this.cargarimagenes();
        this.imagenescargadas =[];
        this.selectedFiles =[];
        console.log("imagenes agregadas");
      },
      error:(_error)  => {
        console.log("imagenes no agregadas");
      }
    });

  }

  onSelectTipo(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTipo = selectElement.value;
  }

  eliminarImagen(index: number) {
    this.imagenescargadas.splice(index, 1);
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);

      //cargar imagencarga []
      this.selectedFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenescargadas.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });

    }
  }

  ObjectKeys(obj: any): string[] {
    //retorna un formato iterable
    return Object.keys(obj);
  }

}
