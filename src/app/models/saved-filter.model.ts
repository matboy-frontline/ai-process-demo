export interface SavedFilter {
  id: string;
  userId: string;
  name: string;
  filterDefinition: FilterDefinition;
  createdAt: Date;
}

export interface FilterDefinition {
  region: string;
  tier: string;
  status: string;
}

export interface SaveFilterRequest {
  name: string;
  filterDefinition: FilterDefinition;
}

export interface SaveFilterResponse {
  id: string;
  name: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: ValidationError[];
}
