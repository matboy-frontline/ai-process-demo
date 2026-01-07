import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  SavedFilter, 
  SaveFilterRequest, 
  SaveFilterResponse,
  ApiError 
} from '../models/saved-filter.model';

@Injectable({
  providedIn: 'root'
})
export class SavedFiltersService {
  private readonly http = inject(HttpClient);
  private readonly API_BASE_URL = '/api/saved-filters';

  saveFilter(request: SaveFilterRequest): Observable<SaveFilterResponse> {
    return this.http.post<SaveFilterResponse>(this.API_BASE_URL, request).pipe(
      catchError(this.handleError)
    );
  }

  getSavedFilters(): Observable<SavedFilter[]> {
    return this.http.get<SavedFilter[]>(this.API_BASE_URL).pipe(
      catchError(this.handleError)
    );
  }

  deleteFilter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    
    const apiError: ApiError = {
      statusCode: error.status,
      message: error.error?.message || 'An error occurred',
      errors: error.error?.errors
    };
    
    return throwError(() => apiError);
  }
}
