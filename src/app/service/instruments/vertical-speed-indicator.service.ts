import { Injectable } from '@angular/core';
import {fabric} from "fabric";
import {FabricBuilderService} from "../fabric-builder.service";
import {DataService} from "../data.service";

@Injectable({
  providedIn: 'root'
})
export class VerticalSpeedIndicatorService {

  pointer: fabric.Triangle;
  verticalScaleGroup: fabric.Group;
  vsiContainer: fabric.Group;

  canvas: fabric.Canvas;

  componentWidth = 50;
  componentHeight = 380;
  verticalPadding = 10;
  pointerSize = 14;
  markList = [
    {top:-180, label:'6'},
    {top:-135, label:'2'},
    {top:-112.5, label:''},
    {top:-90, label:'1'},
    {top:-45, label:''},
    {top:0, label:'0'},
    {top:45, label:''},
    {top:90, label:'1'},
    {top:112.5, label:''},
    {top:135, label:'2'},
    {top:180, label:'6'},
  ];

  constructor(private readonly service: FabricBuilderService,
              private readonly dataService: DataService) {
    this.dataService.getVerticalSpeed$().subscribe(vSpeed => this.updatePointerPosition(vSpeed));
  }


  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  build(): fabric.Group {
    // instrument background
    let background = this.service.createInstrumentBackGround(this.componentWidth, this.componentHeight, 'gray');

    // scale
    this.verticalScaleGroup = this.service.createVerticalScale(this.componentHeight - 2*this.verticalPadding, this.markList);
    this.verticalScaleGroup.width = this.componentWidth;
    this.verticalScaleGroup.height = this.componentHeight;

    // pointer
    this.pointer = this.service.createPointer(this.pointerSize);
    this.verticalScaleGroup.add(this.pointer);

    // instrument container
    this.vsiContainer =  new fabric.Group( [
      background,
      this.verticalScaleGroup,
    ]);

    // instrument position in the canvas
    this.vsiContainer.left = 400;
    this.vsiContainer.top = 50;

    return this.vsiContainer;
  }

  updatePointerPosition(vSpeed: number) {
    this.pointer.top = this.calculatePointerPositionFromVSpeed(vSpeed) + this.pointerSize/2;
    this.pointer.dirty = true;
    this.verticalScaleGroup.dirty = true;
    this.vsiContainer.dirty = true;
    this.canvas.requestRenderAll()
  }

  calculatePointerPositionFromVSpeed(vSpeed: number): number {
    if (vSpeed > 2000) {
      // pixel size = 45
      return -1 * (((vSpeed - 2000) * (45 / 4000)) + 135)
    } else if (vSpeed > 1000 && vSpeed <= 2000) {
      // pixel size = 45
      return -1 * (((vSpeed - 1000) * (45 / 1000)) + 90)
    } else if (vSpeed < -1000 && vSpeed >= -2000) {
      return -1 * (((vSpeed + 1000) * (45 / 1000)) - 90)
    } else if (vSpeed < -2000) {
      return -1 * (((vSpeed + 2000) * (45 / 4000)) - 135)
    } else {
      // pixel size = 90
      return -vSpeed * (90 / 1000)
    }
  }
}
