import { Injectable } from '@angular/core';
import {fabric} from "fabric";
import {FabricBuilderService} from "../fabric-builder.service";
import {DataService} from "../data.service";
import {CalcCoordinateService} from "../calc-coordinate.service";
import {VsiCursor} from "../../model/vsi-cursor.model";
import {DialZone} from "../../model/dial-zone.model";


enum Colors {
  fluo_blue = '#06e9f6',
  fluo_green = '#00ff00',
   needle_green = '#02e602',
   red_alert = '#ff0000'
}


@Injectable({
  providedIn: 'root'
})
export class VerticalSpeedIndicatorService {

  pointer: VsiCursor;
  verticalScaleGroup: fabric.Group;
  vsiContainer: fabric.Group;

  canvas: fabric.Canvas;

  instrumentWidth = 50;
  instrumentHeight = 380;
  verticalPadding = 10;
  pointerSize = 14;
  markList = [
    {top: -190, label: '', size: 28, left: -28, thickness: 1, color: 'white'},
    {top: -180, label: '6', size: 5, left: -5, thickness: 2, color: 'white'},
    {top: -135, label: '2', size: 5, left: -5, thickness: 2, color: 'white'},
    {top: -112.5, label: '', size: 5, left: -5, thickness: 1, color: 'white'},
    {top: -90, label: '1', size: 5, left: -5, thickness: 2, color: 'white'},
    {top: -45, label: '', size: 5, left: -5, thickness: 1, color: 'white'},
    {top: 0, label: '', size: 40, left: -20, thickness: 3, color: 'yellow'},
    {top: 45, label: '', size: 5, left: -5, thickness: 1, color: 'white'},
    {top: 90, label: '1', size: 5, left: -5, thickness: 2, color: 'white'},
    {top: 112.5, label: '', size: 5, left: -5, thickness: 1, color: 'white'},
    {top: 135, label: '2', size: 5, left: -5, thickness: 2, color: 'white'},
    {top: 180, label: '6', size: 5, left: -5, thickness: 2, color: 'white'},
    {top: 190, label: '', size: 25, left: -25, thickness: 1, color: 'white'},
  ];

  constructor(private readonly service: FabricBuilderService,
              private readonly dataService: DataService,
              ) {
    this.dataService.getVerticalSpeed$().subscribe(vSpeed => this.updatePointerWithVerticalSpeed(vSpeed));
  }


  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  build(): fabric.Group {
    // instrument background
    let backgroundLeft = new fabric.Rect({fill: 'gray', width: 20, left: 5, height: this.instrumentHeight, opacity: 0.7});
    let backgroundRight = new DialZone(new fabric.Point(0, -190), new fabric.Point(0, 190), 20, 130, 'gray');
    backgroundRight.set('width', this.instrumentWidth);
    backgroundRight.set('height', this.instrumentHeight);
    backgroundRight.set('opacity', 0.7);

    // scale
    this.verticalScaleGroup = this.service.createVerticalScale(this.instrumentHeight, this.markList);
    this.verticalScaleGroup.width = this.instrumentWidth;
    this.verticalScaleGroup.height = this.instrumentHeight;

    // speed zones
    let zones = this.service.createSpeedZones([
      {y1: -135, y2: -190, color: Colors.red_alert},
      {y1: -90, y2: -135, color: Colors.fluo_green},
      {y1: 0, y2: -20, color: Colors.fluo_green},
      {y1: 0, y2: 20, color: Colors.fluo_green},
      {y1: 90, y2: 135, color:Colors.fluo_green},
      {y1: 135, y2: 190, color: Colors.red_alert},
      ]);
    zones.width = this.instrumentWidth;
    zones.height = this.instrumentHeight;
    zones.originX = 'center';
    zones.originY = 'center';
    this.verticalScaleGroup.add(zones);
    zones.sendToBack()

    // marks
    let mark = new fabric.Polygon([
      {x:0,y:0}, {x:-10,y:5}, {x:-10,y:18}, {x:0,y:18},
      {x:0,y:-18}, {x:-10,y:-18}, {x:-10,y:-5}, {x:0,y:0}
      ], {fill: Colors.fluo_blue})
    this.verticalScaleGroup.add(mark)

    // pointer
    this.pointer = new VsiCursor(Colors.needle_green, 0, 0);
    this.verticalScaleGroup.add(this.pointer);


    // instrument container
    this.vsiContainer =  new fabric.Group( [
      backgroundLeft,
      backgroundRight,
      this.verticalScaleGroup,
    ]);

    // instrument size and position in the canvas
    this.vsiContainer.width = this.instrumentWidth + 20;
    this.vsiContainer.height = this.instrumentHeight + 20;
    this.vsiContainer.left = 700;
    this.vsiContainer.top = 50;

    return this.vsiContainer;
  }

  private updatePointerWithVerticalSpeed(vSpeed: number) {
    if (this.pointer) {
      this.pointer.updateCursor(this.calculatePointerPositionFromVSpeed(vSpeed));
      this.pointer.set('stroke', this.updatePointerColor(vSpeed));
      this.canvas.renderAll()
    }
  }

  private calculatePointerPositionFromVSpeed(vSpeed: number): number {
    if (vSpeed > 6000) {
      return -190;
    } else if (vSpeed < -6000) {
      return 190;
    } else if (vSpeed > 2000) {
      // pixel size = 45
      return -1 * (((vSpeed - 2000) * (45 / 4000)) + 135);
    } else if (vSpeed > 1000 && vSpeed <= 2000) {
      // pixel size = 45
      return -1 * (((vSpeed - 1000) * (45 / 1000)) + 90);
    } else if (vSpeed < -1000 && vSpeed >= -2000) {
      return -1 * (((vSpeed + 1000) * (45 / 1000)) - 90);
    } else if (vSpeed < -2000) {
      return -1 * (((vSpeed + 2000) * (45 / 4000)) - 135);
    } else {
      // pixel size = 90
      return -vSpeed * (90 / 1000);
    }
  }

  private updatePointerColor(vSpeed: number): string {
    if (vSpeed >= 1000 || vSpeed < -1000) {
      return 'gray';
    } else {
      return Colors.needle_green;
    }
  }
}
