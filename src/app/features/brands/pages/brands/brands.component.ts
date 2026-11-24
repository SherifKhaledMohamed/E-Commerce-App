import { BrandService } from './../../../../core/services/brand.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/ui/section-header/section-header.component';
import { Category } from '../../../../core/models/product.interface';
import { RouterLink } from '@angular/router';

@Component({
  imports: [SectionHeaderComponent,RouterLink],
  selector: 'app-brands',
  styleUrl: './brands.component.css',
  templateUrl: './brands.component.html',
})
export class BrandsComponent implements OnInit {
  private readonly brandService = inject(BrandService);
  allBrands = signal<Category[]>([]);

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands() {
    this.brandService.getAllBrands().subscribe({
      next : (res) => {
        this.allBrands.set(res.data);
        console.log(res);
      }
    })
  }

}
