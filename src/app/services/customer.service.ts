import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers: Customer[] = [
    { id: 1, name: 'Acme Corp', email: 'contact@acme.com', region: 'North America', tier: 'Enterprise', status: 'Active', joinDate: new Date('2023-01-15') },
    { id: 2, name: 'TechStart Inc', email: 'hello@techstart.com', region: 'Europe', tier: 'Pro', status: 'Active', joinDate: new Date('2023-03-20') },
    { id: 3, name: 'Global Solutions', email: 'info@globalsol.com', region: 'Asia', tier: 'Enterprise', status: 'Active', joinDate: new Date('2022-11-10') },
    { id: 4, name: 'Local Business', email: 'contact@localbiz.com', region: 'North America', tier: 'Basic', status: 'Inactive', joinDate: new Date('2023-05-22') },
    { id: 5, name: 'Euro Traders', email: 'sales@eurotraders.eu', region: 'Europe', tier: 'Pro', status: 'Active', joinDate: new Date('2023-02-14') },
    { id: 6, name: 'Asia Pacific Ltd', email: 'info@asiapac.com', region: 'Asia', tier: 'Enterprise', status: 'Active', joinDate: new Date('2022-09-05') },
    { id: 7, name: 'StartupHub', email: 'team@startuphub.io', region: 'North America', tier: 'Basic', status: 'Active', joinDate: new Date('2023-06-30') },
    { id: 8, name: 'MegaCorp International', email: 'contact@megacorp.com', region: 'Europe', tier: 'Enterprise', status: 'Active', joinDate: new Date('2021-12-01') },
    { id: 9, name: 'Digital Dynamics', email: 'hello@digitaldyn.com', region: 'Asia', tier: 'Pro', status: 'Pending', joinDate: new Date('2023-07-15') },
    { id: 10, name: 'QuickFix Solutions', email: 'support@quickfix.com', region: 'North America', tier: 'Basic', status: 'Active', joinDate: new Date('2023-04-18') },
    { id: 11, name: 'Nordic Systems', email: 'info@nordicsys.no', region: 'Europe', tier: 'Pro', status: 'Inactive', joinDate: new Date('2022-08-22') },
    { id: 12, name: 'Pacific Ventures', email: 'contact@pacvent.com', region: 'Asia', tier: 'Enterprise', status: 'Active', joinDate: new Date('2023-01-05') },
    { id: 13, name: 'Midwest Partners', email: 'partners@midwest.com', region: 'North America', tier: 'Pro', status: 'Pending', joinDate: new Date('2023-08-10') },
    { id: 14, name: 'Alpine Group', email: 'info@alpinegroup.ch', region: 'Europe', tier: 'Basic', status: 'Active', joinDate: new Date('2023-03-28') },
    { id: 15, name: 'Southeast Trading', email: 'trade@setrading.com', region: 'Asia', tier: 'Pro', status: 'Active', joinDate: new Date('2023-02-20') },
  ];

  getCustomers(): Customer[] {
    return this.customers;
  }

  filterCustomers(region: string, tier: string, status: string): Customer[] {
    return this.customers.filter(customer => {
      const matchesRegion = !region || customer.region === region;
      const matchesTier = !tier || customer.tier === tier;
      const matchesStatus = !status || customer.status === status;
      return matchesRegion && matchesTier && matchesStatus;
    });
  }
}
