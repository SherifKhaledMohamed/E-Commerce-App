import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class CategoryService {
    private readonly httpClient = inject(HttpClient);

    getAllCategories (): Observable<any> {
        return this.httpClient.get(environment.baseUrl + 'categories');
    }

    getSpecificCategory (categoryId:string) : Observable<any> {
        return this.httpClient.get(environment.baseUrl + `categories/${categoryId}`);
    }
    
    getSubCategories (categoryId:string,limit:number = 10) : Observable<any> {
        return this.httpClient.get(environment.baseUrl + `categories/${categoryId}/subcategories`);
    }
    getSpecificSubcategory (subcategoryId:string) : Observable<any> {
        return this.httpClient.get(environment.baseUrl + `subcategories//${subcategoryId}`);
    }
}
