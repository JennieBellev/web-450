import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

interface CustomerFeedback {
  date: string;
  channel: string;
  rating: number;
  feedbackType: string;
  sentiment: string;
  text: string;
  status: string;
}

interface CustomerFeedbackRow {
  Date: string;
  Channel: string;
  Rating: number;
  'Feedback Type': string;
  Sentiment: string;
  Feedback: string;
  Status: string;
}

/**
 * Task M-112: Lets a user search by customer and displays matching feedback
 * through the shared table component.
 */
@Component({
  selector: 'app-feedback-by-customer',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Customer Feedback by Customer</h1>
    <form class="form" [formGroup]="customerForm" (ngSubmit)="onSubmit()">
      <div class="form__group">
        <label class="label" for="customer">Customer</label>
        <input class="input" type="text" formControlName="customer" id="customer" name="customer">
      </div>
      <div class="form__actions">
        <button class="button button--primary" type="submit">Search</button>
      </div>
    </form>

    @if (errorMessage) {
      <div class="message message--error">{{ errorMessage }}</div>
    }

    @if (feedbackData.length > 0) {
      <div class="card">
        <app-table
          [title]="'Customer Feedback for ' + selectedCustomer"
          [data]="feedbackData"
          [headers]="headers"
          [sortableColumns]="['Date', 'Rating', 'Sentiment', 'Status']"
          [headerBackground]="'secondary'">
        </app-table>
      </div>
    }
  `,
  styles: `
    .form, .card {
      width: 100%;
      max-width: 900px;
      margin: 20px auto;
      padding: 10px;
    }
  `
})
export class FeedbackByCustomerComponent {
  readonly headers = ['Date', 'Channel', 'Rating', 'Feedback Type', 'Sentiment', 'Feedback', 'Status'];
  feedbackData: CustomerFeedbackRow[] = [];
  errorMessage = '';
  selectedCustomer = '';

  customerForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      customer: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.errorMessage = 'Please enter a customer.';
      return;
    }

    const customer = this.customerForm.controls['customer'].value?.trim() ?? '';
    if (!customer) {
      this.errorMessage = 'Please enter a customer.';
      return;
    }

    const params = new HttpParams().set('customer', customer);
    this.feedbackData = [];
    this.errorMessage = '';

    this.http.get<CustomerFeedback[]>(
      `${environment.apiBaseUrl}/reports/customer-feedback/by-customer`,
      { params }
    ).subscribe({
      next: (data) => {
        this.selectedCustomer = customer;
        // Convert API field names to the readable column labels used by the table.
        this.feedbackData = data.map((feedback) => ({
          Date: feedback.date,
          Channel: feedback.channel,
          Rating: feedback.rating,
          'Feedback Type': feedback.feedbackType,
          Sentiment: feedback.sentiment,
          Feedback: feedback.text,
          Status: feedback.status
        }));
        this.errorMessage = this.feedbackData.length
          ? ''
          : `No feedback found for ${customer}.`;
      },
      error: () => {
        this.errorMessage = 'Unable to fetch customer feedback. Please try again.';
      }
    });
  }
}
