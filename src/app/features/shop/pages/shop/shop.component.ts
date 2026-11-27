import { ShopService } from './../../../../core/services/shop.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SectionHeaderComponent } from '../../../../shared/ui/section-header/section-header.component';
import { Product } from '../../../../core/models/product.interface';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../../../core/services/category.service';
import { BrandService } from '../../../../core/services/brand.service';

@Component({
  imports: [SectionHeaderComponent, CardComponent, NgxPaginationModule, RouterLink],
  selector: 'app-shop',
  styleUrl: './shop.component.css',
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly brandService = inject(BrandService);
  


  allProducts = signal<Product[]>([]);
  pageSize = signal(0)
  p = signal(0)
  total =signal(0)

  catId = signal<string>('')
  brandId = signal<string>('')
  subcategoryId = signal<string>('');
  

  filterTag = signal<string>('');


  ngOnInit(): void {
    this.getQueryParams();
  }

  getAllProducts(pageNumber:number = 1) {
    this.shopService.GetAllProducts(pageNumber,this.catId(),this.brandId(),this.subcategoryId()).subscribe({
      next: (res) => {
        console.log(res.data)
        this.allProducts.set(res.data)

        this.pageSize.set(res.metadata.limit)
        this.p.set(res.metadata.currentPage)
        this.total.set(res.results)
      }
    })
  }

  pageChanged(e:number) {
    this.getAllProducts(e);
  }

  getQueryParams() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.catId.set(params.get('category') ?? '');
      this.brandId.set(params.get('brand') ?? '');
      this.subcategoryId.set(params.get('subcategory') ?? '');
      

      if(this.catId()) {
      this.categoryService.getSpecificCategory(this.catId()).subscribe({
        next : (res) => {this.filterTag.set(res.data.name); console.log(res.data)}
      });
    }
    else if(this.subcategoryId()) {
      this.categoryService.getSpecificSubcategory(this.subcategoryId()).subscribe({
        next : (res) => {this.filterTag.set(res.data.name); console.log(res.data)}

      });
    }
    else if(this.brandId()) {
      this.brandService.getSpecificBrand(this.brandId()).subscribe({next : (res) => {this.filterTag.set(res.data.name); console.log(res.data)}});
    }
    else {this.filterTag.set('');}

      this.getAllProducts(1);
    });
  }
}
