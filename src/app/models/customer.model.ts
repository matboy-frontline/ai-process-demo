export interface Customer {
  id: number;
  name: string;
  email: string;
  region: string;
  tier: string;
  status: string;
  joinDate: Date;
}

export interface FilterPreset {
  id: string;
  name: string;
  region: string;
  tier: string;
  status: string;
}
