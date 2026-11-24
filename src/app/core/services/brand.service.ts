import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class BrandService {
    private readonly httpClient = inject(HttpClient);

    getAllBrands() : Observable<any> {
        return this.httpClient.get(environment.baseUrl + `brands`);
    }

    getSpecificBrand(brandId:string) : Observable<any> {
        return this.httpClient.get(environment.baseUrl + `brands/${brandId}`);
    }
}
