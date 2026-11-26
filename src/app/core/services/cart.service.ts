import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { count } from 'console';
import { Observable } from 'rxjs';

@Service()
export class CartService {
    private readonly httpClient = inject(HttpClient);

    addToCart(productId:string):Observable<any> {
        return this.httpClient.post(environment.baseUrl + `cart`,{productId:productId});
    }
    updateCartQuantities(productId:string,count:number = 1):Observable<any>  {
        return this.httpClient.put(environment.baseUrl + `cart/${productId}`,{count:count});
    }
}
