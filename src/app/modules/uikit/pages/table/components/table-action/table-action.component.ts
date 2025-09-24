import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TableFilterService } from '../../services/table-filter.service';

@Component({
  selector: 'app-table-action',
  imports: [AngularSvgIconModule, CommonModule, FormsModule],
  templateUrl: './table-action.component.html',
  styleUrl: './table-action.component.css',
})
export class TableActionComponent {
  // Recibe las opciones de los select y placeholders
  @Input() title: string = '';
  @Input() searchPlaceholder: string = 'Search...';
  /* Si vamos a implementar las otras cosas que por orden o selección seria ponerlo aqui */


  // Inyección del servicio de la tabla
  constructor(public filterService: TableFilterService) {}

}
