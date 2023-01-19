import { Injectable } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root'
})
export class FabricBuilderService {

  constructor() { }

  createInstrumentBackGround(width: number, height: number, fill: string): fabric.Rect {
    return new fabric.Rect({
        fill: fill,
        width: width,
        height: height,
        opacity: 0.7,
      });
  }

  createVerticalScale(size: number, markList: any[]) {
    let verticalScaleGroup = new fabric.Group()
    let verticalLine = new fabric.Line([0, 0, 0, size], {
      originX:'center',
      originY:'center',
      left: 0,
      top: 0,
      stroke: 'white',
    });
    verticalScaleGroup.add(verticalLine);

    markList.forEach(mark => {
      verticalScaleGroup.add(
        new fabric.Line([0, 0, mark.size, 0], {
          left: mark.left,
          top: mark.top,
          stroke: mark.color,
          strokeWidth: mark.thickness
        }),
        new fabric.Text(mark.label, {
          left: -18,
          top: mark.top - 7,
          stroke: mark.color,
          fontSize: 12,
        }),
      )
    })

    return verticalScaleGroup;
  }

  createPointer(size: number, position: number = 0) {
    let pointer = new fabric.Triangle({
      width: size,
      height: size,
      fill: 'green',
      left: 0,
      top: position + size/2,
      angle: -90,
    })
    return pointer;
  }
}
