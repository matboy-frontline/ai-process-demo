import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer, FilterPreset } from '../models/customer.model';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule],
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
  
  // Filter presets
  filterPresets: FilterPreset[] = [];
  presetName = '';
  showSavePreset = false;

  constructor(private customerService: CustomerService) {}

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
}
