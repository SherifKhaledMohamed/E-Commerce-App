import { productOfCart } from './../models/cart.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.interface';

@Service()
export class WishlistService {
    private readonly httpClient = inject(HttpClient)
    addToWishlist(data:object):Observable<any> {
        return this.httpClient.post(environment.baseUrl + `wishlist`,data);
    }
    removeFromWishlist(id:string):Observable<any> {
        return this.httpClient.delete(environment.baseUrl + `wishlist/${id}`);
    }
    getUserWishlist():Observable<any> {
        return this.httpClient.get(environment.baseUrl + `wishlist`);
    }
}
