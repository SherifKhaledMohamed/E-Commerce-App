import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class AuthService {
    private readonly httpClient = inject(HttpClient);
    isLogged = signal(false);

    signUp(data:object): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'auth/signup', data)
    }
    signIn(data:object): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'auth/signin', data)
    }

    forgetPassword(data:object): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'auth/forgotPasswords', data)
    }
    verifyCode(data:object): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'auth/verifyResetCode', data)
    }
    resetPassword(data:object): Observable<any> {
        return this.httpClient.put(environment.baseUrl + 'auth/resetPassword', data)
    }
    changePassword(data:object): Observable<any> {
        return this.httpClient.put(environment.baseUrl + 'users/changeMyPassword',data);
    }
}
