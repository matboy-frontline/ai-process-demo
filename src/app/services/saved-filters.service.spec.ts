import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SavedFiltersService } from './saved-filters.service';
import { SaveFilterRequest, SaveFilterResponse, FilterDefinition } from '../models/saved-filter.model';

describe('SavedFiltersService', () => {
  let service: SavedFiltersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SavedFiltersService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SavedFiltersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveFilter', () => {
    it('should save a filter and return response', () => {
      const filterDefinition: FilterDefinition = {
        region: 'North America',
        tier: 'Enterprise',
        status: 'Active'
      };

      const request: SaveFilterRequest = {
        name: 'Enterprise NA Active',
        filterDefinition
      };

      const mockResponse: SaveFilterResponse = {
        id: '123',
        name: 'Enterprise NA Active'
      };

      service.saveFilter(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/saved-filters');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });

    it('should handle 400 validation error', () => {
      const request: SaveFilterRequest = {
        name: 'test@example.com',
        filterDefinition: { region: '', tier: '', status: '' }
      };

      service.saveFilter(request).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.statusCode).toBe(400);
          expect(error.message).toBe('Validation failed');
        }
      });

      const req = httpMock.expectOne('/api/saved-filters');
      req.flush(
        { message: 'Validation failed', errors: [{ field: 'name', message: 'Name contains PII' }] },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle 409 limit exceeded error', () => {
      const request: SaveFilterRequest = {
        name: 'Valid Name',
        filterDefinition: { region: '', tier: '', status: '' }
      };

      service.saveFilter(request).subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error) => {
          expect(error.statusCode).toBe(409);
        }
      });

      const req = httpMock.expectOne('/api/saved-filters');
      req.flush(
        { message: 'Maximum of 25 saved filters reached' },
        { status: 409, statusText: 'Conflict' }
      );
    });
  });

  describe('getSavedFilters', () => {
    it('should retrieve saved filters', () => {
      const mockFilters = [
        {
          id: '1',
          userId: 'user123',
          name: 'Filter 1',
          filterDefinition: { region: 'Europe', tier: 'Pro', status: 'Active' },
          createdAt: new Date()
        }
      ];

      service.getSavedFilters().subscribe(filters => {
        expect(filters.length).toBe(1);
        expect(filters[0].name).toBe('Filter 1');
      });

      const req = httpMock.expectOne('/api/saved-filters');
      expect(req.request.method).toBe('GET');
      req.flush(mockFilters);
    });
  });

  describe('deleteFilter', () => {
    it('should delete a filter', () => {
      const filterId = '123';

      service.deleteFilter(filterId).subscribe(() => {
        expect(true).toBe(true);
      });

      const req = httpMock.expectOne(`/api/saved-filters/${filterId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
