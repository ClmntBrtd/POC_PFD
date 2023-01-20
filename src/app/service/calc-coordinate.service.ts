import { Injectable } from '@angular/core';

export interface Coordinate2d extends fabric.IPoint {

}

@Injectable({
  providedIn: 'root'
})
export class CalcCoordinateService {

  constructor() { }

  calcCoordinates(a: Coordinate2d, bx: number, c: Coordinate2d): number {
    // m = DeltaY / DeltaX = Cy-Ay / Cx-Ax
    const m = ( c.y - a.y ) / ( c.x - a.x );

    // b = Ay - (m * Ax)
    const g = a.y - ( m * a.x );

    // By = m * Bx + b
    const by = m * bx + g;

    return by;
  }
}
