import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import {DialZone} from "../model/dial-zone.model";
import {Polygon} from "fabric/fabric-impl";

export interface ZoneData {
  y1: number,
  y2: number,
  color: string,
  opacity?: number,
}

@Injectable({
  providedIn: 'root'
})
export class FabricBuilderService {

  constructor() { }

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

  createSpeedZones(zoneCoord: ZoneData[]): fabric.Group {
    let speedZoneGroup = new fabric.Group();
    zoneCoord.forEach(zc => speedZoneGroup.add(new DialZone(new fabric.Point(0, zc.y1), new fabric.Point(0, zc.y2), 15, 130, zc.color)));
    return speedZoneGroup;
  }

  createPointer(size: number, position: number = 0): fabric.Triangle {
    return new fabric.Triangle({
      width: size,
      height: size,
      fill: 'green',
      left: 0,
      top: position + size/2,
      angle: -90,
    })
  }
}

