import { fabric } from 'fabric';

export class VsiCursor extends fabric.Line {

  x3: number;
  y3: number;

  constructor( color: string, y1: number, y2: number, y3: number=0, x1: number=0, x2: number=20, x3: number=130) {
    super([x1, y1, x2, y2]);
    this.x3 = x3;
    this.y3 = y3;
    this.type = 'vsiCursor';
    this.stroke = color;
    this.strokeWidth = 3;
  }

  updateCursor(y1: number): void {
    this.y1 = y1;
    this.calcY2Coordinates();
    this.set('y1', this.y1);
    this.set('y2', this.y2);
    this.set('dirty', true)
  }

  calcY2Coordinates(): void {
    if(this.x1 != null && this.y1 != null && this.x2 != null && this.y2 != null) {
      // m = Dy / Dx = y3-y1 / x3-x1
      const m = ( this.y3 - this.y1 ) / ( this.x3 - this.x1 );

      // b = y1 - (m * x1)
      // b = y1 if x1 = 0
      const b = this.y1 - ( m * this.x1 );

      // y2 = m * x2 + b
      this.y2 = m * this.x2 + b
    }
  }

}
