import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackByCustomerComponent } from './feedback-by-customer.component';
import { environment } from '../../../../environments/environment';

describe('FeedbackByCustomerComponent', () => {
  let component: FeedbackByCustomerComponent;
  let fixture: ComponentFixture<FeedbackByCustomerComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FeedbackByCustomerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackByCustomerComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpTestingController.verify());

  it('should create and display the report title', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h1').textContent)
      .toContain('Customer Feedback by Customer');
  });

  it('should require a customer before making a request', () => {
    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Please enter a customer.');
    httpTestingController.expectNone(`${environment.apiBaseUrl}/reports/customer-feedback/by-customer`);
  });

  it('should display the returned feedback records for the entered customer', () => {
    component.customerForm.controls['customer'].setValue('Jane Doe');
    component.onSubmit();

    const request = httpTestingController.expectOne((req) =>
      req.url === `${environment.apiBaseUrl}/reports/customer-feedback/by-customer` &&
      req.params.get('customer') === 'Jane Doe'
    );
    expect(request.request.method).toBe('GET');
    request.flush([{
      date: '2024-01-15',
      channel: 'Email',
      rating: 5,
      feedbackType: 'Positive',
      sentiment: 'Positive',
      text: 'Helpful service',
      status: 'Resolved'
    }]);
    fixture.detectChanges();

    const cells = fixture.nativeElement.querySelectorAll('.table__body .table__cell');
    expect(cells.length).toBe(7);
    expect(cells[0].textContent.trim()).toBe('2024-01-15');
    expect(cells[5].textContent.trim()).toBe('Helpful service');
    expect(fixture.nativeElement.querySelector('.table__title').textContent)
      .toContain('Jane Doe');
  });
});
