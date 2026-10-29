import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { SalesByProductComponent } from './sales-by-product.component';

describe('SalesByProductComponent', () => {
  let component: SalesByProductComponent;
  let fixture: ComponentFixture<SalesByProductComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByProductComponent, HttpClientTestingModule]
    })
    .compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SalesByProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    httpTestingController.expectOne(`${environment.apiBaseUrl}/reports/sales/products`).flush([]);
    expect(component).toBeTruthy();
  });

  it('should display the fetched product sales', () => {
    httpTestingController.expectOne(`${environment.apiBaseUrl}/reports/sales/products`).flush([
      { product: 'Laptop', totalSales: 5000 }
    ]);
    fixture.detectChanges();

    expect(component.productSales).toEqual([
      { Product: 'Laptop', 'Total Sales': 5000 }
    ]);
    expect(fixture.nativeElement.textContent).toContain('Laptop');
    expect(fixture.nativeElement.textContent).toContain('5000');
  });
});
