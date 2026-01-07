import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { SavedFiltersService } from '../services/saved-filters.service';
import { Customer, FilterPreset } from '../models/customer.model';
import { SaveFilterRequest, FilterDefinition, ApiError } from '../models/saved-filter.model';
import { SaveFilterDialogComponent } from '../components/organisms/save-filter-dialog/save-filter-dialog.component';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule, SaveFilterDialogComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  
  // Filter values
  selectedRegion = '';
  selectedTier = '';
  selectedStatus = '';
  
  // Available options
  regions = ['North America', 'Europe', 'Asia'];
  tiers = ['Basic', 'Pro', 'Enterprise'];
  statuses = ['Active', 'Inactive', 'Pending'];
  
  // Filter presets (legacy localStorage)
  filterPresets: FilterPreset[] = [];
  presetName = '';
  showSavePreset = false;

  // New save filter dialog state
  private readonly _showSaveDialog = signal(false);
  readonly showSaveDialog = this._showSaveDialog.asReadonly();
  
  private readonly _saveError = signal<string | null>(null);
  readonly saveError = this._saveError.asReadonly();
  
  private readonly _isSaving = signal(false);
  readonly isSaving = this._isSaving.asReadonly();

  constructor(
    private customerService: CustomerService,
    private savedFiltersService: SavedFiltersService
  ) {}

  ngOnInit(): void {
    this.customers = this.customerService.getCustomers();
    this.filteredCustomers = this.customers;
    this.loadPresets();
  }

  applyFilters(): void {
    this.filteredCustomers = this.customerService.filterCustomers(
      this.selectedRegion,
      this.selectedTier,
      this.selectedStatus
    );
  }

  clearFilters(): void {
    this.selectedRegion = '';
    this.selectedTier = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  savePreset(): void {
    if (!this.presetName.trim()) {
      alert('Please enter a preset name');
      return;
    }

    const preset: FilterPreset = {
      id: Date.now().toString(),
      name: this.presetName,
      region: this.selectedRegion,
      tier: this.selectedTier,
      status: this.selectedStatus
    };

    this.filterPresets.push(preset);
    localStorage.setItem('filterPresets', JSON.stringify(this.filterPresets));
    
    this.presetName = '';
    this.showSavePreset = false;
    alert('Filter preset saved!');
  }

  loadPreset(preset: FilterPreset): void {
    this.selectedRegion = preset.region;
    this.selectedTier = preset.tier;
    this.selectedStatus = preset.status;
    this.applyFilters();
  }

  deletePreset(presetId: string): void {
    this.filterPresets = this.filterPresets.filter(p => p.id !== presetId);
    localStorage.setItem('filterPresets', JSON.stringify(this.filterPresets));
  }

  loadPresets(): void {
    const saved = localStorage.getItem('filterPresets');
    if (saved) {
      this.filterPresets = JSON.parse(saved);
    }
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedRegion || this.selectedTier || this.selectedStatus);
  }

  // New save filter methods
  openSaveFilterDialog(): void {
    this._showSaveDialog.set(true);
    this._saveError.set(null);
  }

  closeSaveFilterDialog(): void {
    this._showSaveDialog.set(false);
    this._saveError.set(null);
  }

  onSaveFilter(name: string): void {
    if (this._isSaving()) {
      return;
    }

    this._isSaving.set(true);
    this._saveError.set(null);

    const filterDefinition: FilterDefinition = {
      region: this.selectedRegion,
      tier: this.selectedTier,
      status: this.selectedStatus
    };

    const request: SaveFilterRequest = {
      name,
      filterDefinition
    };

    this.savedFiltersService.saveFilter(request).subscribe({
      next: (response) => {
        this._isSaving.set(false);
        this._showSaveDialog.set(false);
        
        // Show success message
        alert(`Filter "${response.name}" saved successfully!`);
        
        // Optionally reload saved filters list
        // this.loadSavedFilters();
      },
      error: (error: ApiError) => {
        this._isSaving.set(false);
        
        // Handle different error types
        if (error.statusCode === 409) {
          this._saveError.set('You have reached the maximum of 25 saved filters. Please delete an existing filter before saving a new one.');
        } else if (error.statusCode === 400 && error.errors) {
          const validationMessages = error.errors.map(e => e.message).join(', ');
          this._saveError.set(validationMessages);
        } else {
          this._saveError.set(error.message || 'Failed to save filter. Please try again.');
        }
      }
    });
  }
}
