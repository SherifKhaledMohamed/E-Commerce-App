import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { count } from 'console';
import { Observable } from 'rxjs';

@Service()
export class CartService {
    private readonly httpClient = inject(HttpClient);
    cartItems = signal(0);

    addToCart(productId:string):Observable<any> {
        return this.httpClient.post(environment.baseUrl + `cart`,{productId:productId});
    }
    updateCartQuantities(productId:string,count:number = 1):Observable<any>  {
        return this.httpClient.put(environment.baseUrl + `cart/${productId}`,{count:count});
    }
    getLoggedUserCart():Observable<any> {
        return this.httpClient.get(environment.baseUrl + 'cart');
    }
    clearAllCartItems():Observable<any> {
        return this.httpClient.delete(environment.baseUrl+'cart');
    }
}
