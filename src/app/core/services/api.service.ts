import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private http = inject(HttpClient);

  private readonly baseUrl =
    environment.apiUrl;

  get<T>(endpoint: string) {
    return this.http.get<T>(
      `${this.baseUrl}/${endpoint}`
    );
  }

  getById<T>(
    endpoint: string,
    id: number
  ) {
    return this.http.get<T>(
      `${this.baseUrl}/${endpoint}/${id}`
    );
  }

  create<T>(
    endpoint: string,
    payload: T
  ) {
    return this.http.post(
      `${this.baseUrl}/${endpoint}`,
      payload
    );
  }

  update<T>(
    endpoint: string,
    id: string| number,
    payload: T
  ) {
    return this.http.put(
      `${this.baseUrl}/${endpoint}/${id}`,
      payload
    );
  }

  delete(
    endpoint: string,
    id: string| number
  ) {
    return this.http.delete(
      `${this.baseUrl}/${endpoint}/${id}`
    );
  }
}