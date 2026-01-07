import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveFilterDialogComponent } from './save-filter-dialog.component';

describe('SaveFilterDialogComponent', () => {
  let component: SaveFilterDialogComponent;
  let fixture: ComponentFixture<SaveFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveFilterDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SaveFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable save button when name is empty', () => {
    component.onNameChange('');
    expect(component.canSave()).toBe(false);
  });

  it('should disable save button when name exceeds 50 characters', () => {
    const longName = 'a'.repeat(51);
    component.onNameChange(longName);
    expect(component.canSave()).toBe(false);
  });

  it('should show validation error for email in name', () => {
    component.onNameChange('test@example.com');
    expect(component.validationError()).toContain('sensitive information');
  });

  it('should show validation error for phone number in name', () => {
    component.onNameChange('Call 555-123-4567');
    expect(component.validationError()).toContain('sensitive information');
  });

  it('should show validation error for full name pattern', () => {
    component.onNameChange('John Smith');
    expect(component.validationError()).toContain('sensitive information');
  });

  it('should enable save button with valid name', () => {
    component.onNameChange('West Region Filters');
    expect(component.canSave()).toBe(true);
    expect(component.validationError()).toBe(null);
  });

  it('should emit save event with trimmed name', () => {
    let emittedName = '';
    
    // Subscribe before triggering
    const subscription = component.save.subscribe((name: string) => {
      emittedName = name;
    });

    component.onNameChange('  Valid Name  ');
    component.onSave();
    
    fixture.detectChanges();
    
    expect(emittedName).toBe('Valid Name');
    subscription.unsubscribe();
  });

  it('should emit cancel event', () => {
    let cancelled = false;
    
    const subscription = component.cancel.subscribe(() => {
      cancelled = true;
    });

    component.onCancel();
    fixture.detectChanges();
    
    expect(cancelled).toBe(true);
    subscription.unsubscribe();
  });

  it('should reset form after save', () => {
    component.onNameChange('West Region Filters');
    
    const subscription = component.save.subscribe(() => {});
    component.onSave();
    subscription.unsubscribe();
    
    expect(component.filterName()).toBe('');
  });

  it('should reset form after cancel', () => {
    component.onNameChange('Test Filter');
    component.onCancel();
    expect(component.filterName()).toBe('');
  });
});
