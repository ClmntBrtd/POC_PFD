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
        new fabric.Line([0, 0, 10, 0], {
          left: -5,
          top: mark.top,
          stroke: 'white',
        }),
        new fabric.Text(mark.label, {
          left: -20,
          top: mark.top - 10,
          stroke: 'white',
          fontSize: 15,
        }),
      )
    })

    return verticalScaleGroup;
  }

  createPointer(size: number, position: number = 0) {
    let pointer = new fabric.Triangle({
      width: size,
      height: size,
      fill: 'black',
      left: 0,
      top: position + size/2,
      angle: -90,
    })
    return pointer;
  }
}
