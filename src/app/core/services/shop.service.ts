import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class ShopService {
    private readonly httpClient = inject(HttpClient)


    GetAllProducts(
    pageNumber: number = 1,
    categoryId: string = '',
    brandId: string = '',
    subcategoryId: string = ''
  ):Observable<any> {
    let params = new HttpParams();
    if (categoryId) {
      params = params.set('category[in]', categoryId);
    }
    else if (brandId) {
      params = params.set('brand', brandId);
    }
    else if (subcategoryId) {
      params = params.set('subcategory', subcategoryId);
    }
        return this.httpClient.get(environment.baseUrl + `products?page=${pageNumber}`,{params});
    }
    GetSpecificProduct(productId:string):Observable<any> {
        return this.httpClient.get(environment.baseUrl + `products/${productId}`);
    }
}
