import {fabric} from "fabric";
import {CalcCoordinateService} from "../service/calc-coordinate.service";


export class DialZone extends fabric.Polygon {

  service: CalcCoordinateService;

  constructor(a1: fabric.Point, a2: fabric.Point, bx: number, cx: number, color: string) {
    super([]);
    this.service = new CalcCoordinateService();

    this.build(a1, a2, bx, cx)
    this.set('fill', color)
    this.set('dirty', true);
  }

  build(a1: fabric.Point, a2: fabric.Point, bx: number, cx: number) {
    const b1y = this.service.calcCoordinates(a1, bx, { x: cx, y: 0 });
    const b2y = this.service.calcCoordinates(a2, bx, { x: cx, y: 0 });

    const b1 = new fabric.Point(bx, b1y);
    const b2 = new fabric.Point(bx, b2y);

    this.set('points', [ a1, a2, b2, b1 ]);

  }


}
