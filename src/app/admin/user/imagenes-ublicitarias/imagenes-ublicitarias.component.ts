import { Component, OnInit } from '@angular/core';
import { ArchivosService } from '../../services/archivos.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-imagenes-ublicitarias',
  standalone: true,
  imports: [],
  templateUrl: './imagenes-ublicitarias.component.html',
  styleUrl: './imagenes-ublicitarias.component.css'
})
export class ImagenesUblicitariasComponent implements OnInit{

  constructor(
    private archivosService: ArchivosService,
    private modalService: NgbModal){}

  closeResult = '';
  selectedTipo = "";
  imagenescargadas : string[] = [];
  selectedFiles : File[]=[];
  archivosAgrupados: Record<string, string[]> = {};
  ngOnInit(): void {
    this.cargarimagenes();
  }

  cargarimagenes(){
    this.archivosService.getImagenesPublicitarias().subscribe(
      data => {
        this.archivosAgrupados = data;
      }
    );
  }

  guardarimagenes(content: any) {

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
        content.dismiss('cancel');
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

  abrirModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-header modal-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
