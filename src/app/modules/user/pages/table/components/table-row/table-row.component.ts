import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { User } from 'src/app/modules/user/models/user.model';


@Component({
  selector: '[app-table-row]',
  standalone: true,
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './table-row.component.html'
})
export class TableRowComponent {
  @Input() user!: User;
  @Output() onEdit = new EventEmitter<number>();
  @Output() onView = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onSelectionChange = new EventEmitter<{user: User, selected: boolean}>();

  showActionsMenu = false;

  // Close menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-actions-menu]')) {
      this.showActionsMenu = false;
    }
  }

  toggleActionsMenu(): void {
    console.log('Toggling actions menu');
    this.showActionsMenu = !this.showActionsMenu;
    console.log('Actions menu state:', this.showActionsMenu);
  }

  viewUser(event: Event): void {
    event.preventDefault();
    this.showActionsMenu = false;
    if (this.user._id) {
      this.onView.emit(this.user._id);
    }
  }

  editUser(event: Event): void {
    event.preventDefault();
    this.showActionsMenu = false;
    if (this.user._id) {
      this.onEdit.emit(this.user._id);
    }
  }

  deleteUser(event: Event): void {
    event.preventDefault();
    this.showActionsMenu = false;
    if (this.user._id) {
      this.onDelete.emit(this.user._id);
    }
  }

  onSelectionsChange(): void {
    this.onSelectionChange.emit({
      user: this.user,
      selected: this.user.selected || false
    });
  }
}