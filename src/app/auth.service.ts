import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}

  requestLogin(email: string, passwd: string) {
    return this.http.post("https://rtfw0.sse.codesandbox.io/auth/login", {
      email: email,
      passwd: passwd
    });
  }
}
