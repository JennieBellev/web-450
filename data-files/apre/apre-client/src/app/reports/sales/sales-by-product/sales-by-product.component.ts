/**
 * Author: Professor Krasso / Modified by Jennifer (Jennie) Snyder
 * Date: 28 October 2026
 * File: sales-by-product.component.ts
 * Description: Angular component for displaying sales data by product (Task m-065).
 *
 * ============================================================================
 */

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

interface ProductSalesResponse {
  product: string;
  totalSales: number;
}

interface ProductSalesRow {
  Product: string;
  'Total Sales': number;
}

@Component({
  selector: 'app-sales-by-product',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="sales-by-product-container">
      <h2>Sales by Product</h2>
      <p class="subtitle">Sprint 1 Major Task m-065: Aggregated sales performance by product line.</p>

      <div *ngIf="loading" class="loading-state"> Loading sales data...</div>

      <app-table
        *ngIf="!loading"
        [data]="productSales"
        [headers]="['Product', 'Total Sales']"
        [sortableColumns]="['Product', 'Total Sales']"
        [title]="'Sales by Product'">
      </app-table>
    </div>
  `,
  styles: [`
    .sales-by-product-container {
      padding: 24px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    h2 {
      margin-bottom: 8px;
      color: #333;
    }
    .subtitle {
      color: #666;
      margin-bottom: 20px;
    }
    .loading-state {
      font-style: italic;
      color: #888;
      padding: 20px 0;
    }
  `]
})
export class SalesByProductComponent implements OnInit {
  productSales: ProductSalesRow[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<ProductSalesResponse[]>(`${environment.apiBaseUrl}/reports/sales/products`).subscribe({
      next: (data) => {
        this.productSales = data.map(({ product, totalSales }) => ({
          Product: product,
          'Total Sales': totalSales
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching sales by product:', err);
        this.loading = false;
      }
    });
  }
}