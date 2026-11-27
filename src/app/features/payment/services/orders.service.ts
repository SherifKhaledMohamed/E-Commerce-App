import { NavbarComponent } from './../../../layout/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Service()
export class OrdersService {
    private readonly httpClient = inject(HttpClient);

    cashOrder(cartId:string, data:object):Observable<any> {
        return this.httpClient.post(environment.baseUrl + `orders/${cartId}`,data)
    }
    visaOrderCheckout(cartId:string, data:object):Observable<any> {
        return this.httpClient.post(environment.baseUrl + `orders/checkout-session/${cartId}?url=http://localhost:4200/`,data)
    }
}
