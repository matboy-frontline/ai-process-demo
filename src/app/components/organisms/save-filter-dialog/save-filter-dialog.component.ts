import { Component, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-save-filter-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './save-filter-dialog.component.html',
  styleUrls: ['./save-filter-dialog.component.scss']
})
export class SaveFilterDialogComponent {
  // Outputs
  readonly save = output<string>();
  readonly cancel = output<void>();

  // Internal state
  private readonly _filterName = signal('');
  readonly filterName = this._filterName.asReadonly();
  
  private readonly _validationError = signal<string | null>(null);
  readonly validationError = this._validationError.asReadonly();

  // Computed
  readonly isValid = computed(() => {
    const name = this._filterName();
    if (!name.trim()) {
      return false;
    }
    if (name.length > 50) {
      return false;
    }
    if (this.containsPII(name)) {
      return false;
    }
    return true;
  });

  readonly canSave = computed(() => this.isValid());

  onNameChange(value: string): void {
    this._filterName.set(value);
    this.validateName(value);
  }

  onSave(): void {
    if (this.canSave()) {
      const trimmedName = this._filterName().trim();
      this.save.emit(trimmedName);
      this.reset();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.reset();
  }

  private validateName(name: string): void {
    if (!name.trim()) {
      this._validationError.set('Filter name is required');
      return;
    }
    
    if (name.length > 50) {
      this._validationError.set('Filter name must be 50 characters or less');
      return;
    }
    
    if (this.containsPII(name)) {
      this._validationError.set('Filter name contains potentially sensitive information. Please use a generic name.');
      return;
    }
    
    this._validationError.set(null);
  }

  private containsPII(text: string): boolean {
    // Email pattern
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (emailPattern.test(text)) {
      return true;
    }
    
    // Phone pattern (various formats)
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    if (phonePattern.test(text)) {
      return true;
    }
    
    // Simple full name heuristic (First Last with capital letters)
    const namePattern = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/;
    if (namePattern.test(text)) {
      return true;
    }
    
    return false;
  }

  private reset(): void {
    this._filterName.set('');
    this._validationError.set(null);
  }
}
