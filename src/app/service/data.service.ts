import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  verticalSpeed$ = new BehaviorSubject<number>(0);

  constructor() { }

  getVerticalSpeed$(): Observable<number> {
    return this.verticalSpeed$;
  }

  setVerticalSpeed(vSpeed: number): void {
    this.verticalSpeed$.next(vSpeed);
  }
}
