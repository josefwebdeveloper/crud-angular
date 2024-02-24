import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {Post, Posts} from "../models/posts";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor( private http: HttpClient) { }
  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(environment.baseUrl)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  get(id: number): Observable<Post> {
    return this.http.get<any>(`${environment.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(data: any): Observable<any> {
    return this.http.post(environment.baseUrl, data)
      .pipe(catchError(this.handleError));
  }

  update(id: number, data: Post): Observable<any> {
    return this.http.put(`${environment.baseUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    // Logic to determine the type of error and message to provide
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
    }

    // Use throwError with a factory function
    return throwError(() => new Error(errorMessage));
  }

}
