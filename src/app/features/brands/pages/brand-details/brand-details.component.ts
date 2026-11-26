import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Category } from '../../../../core/models/product.interface';
import { BrandService } from '../../../../core/services/brand.service';
import { SectionHeaderComponent } from '../../../../shared/ui/section-header/section-header.component';
import { DatePipe } from '@angular/common';

@Component({
  imports: [SectionHeaderComponent,RouterLink,DatePipe],
  selector: 'app-brand-details',
  styleUrl: './brand-details.component.css',
  templateUrl: './brand-details.component.html',
})
export class BrandDetailsComponent {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly brandService = inject(BrandService);
  brandId = signal('');
  brand = signal<Category>({} as Category);

  ngOnInit(): void {
    this.getBrand();
  }

  getBrand() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.brandId.set(params.get('id')!);
      this.getBrandbyId(params.get('id')!);
    })
  }

  getBrandbyId(brandId:string) {
    this.brandService.getSpecificBrand(brandId).subscribe({
      next : (res) => {
        this.brand.set(res.data);
        console.log(res.data)
      }
    })
  }

}
