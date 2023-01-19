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

  instrumentWidth = 50;
  instrumentHeight = 380;
  verticalPadding = 10;
  pointerSize = 14;
  markList = [
    {top: -190, label: '', size: 25, left: -25, thickness: 1, color: 'white'},
    {top: -180, label: '6', size: 10, left: -5, thickness: 2, color: 'white'},
    {top: -135, label: '2', size: 10, left: -5, thickness: 2, color: 'white'},
    {top: -112.5, label: '', size: 10, left: -5, thickness: 1, color: 'white'},
    {top: -90, label: '1', size: 10, left: -5, thickness: 2, color: 'white'},
    {top: -45, label: '', size: 10, left: -5, thickness: 1, color: 'white'},
    {top: 0, label: '', size: 50, left: -25, thickness: 3, color: 'yellow'},
    {top: 45, label: '', size: 10, left: -5, thickness: 1, color: 'white'},
    {top: 90, label: '1', size: 10, left: -5, thickness: 2, color: 'white'},
    {top: 112.5, label: '', size: 10, left: -5, thickness: 1, color: 'white'},
    {top: 135, label: '2', size: 10, left: -5, thickness: 2, color: 'white'},
    {top: 180, label: '6', size: 10, left: -5, thickness: 2, color: 'white'},
    {top: 190, label: '', size: 25, left: -25, thickness: 1, color: 'white'},
  ];

  constructor(private readonly service: FabricBuilderService,
              private readonly dataService: DataService) {
    this.dataService.getVerticalSpeed$().subscribe(vSpeed => this.updatePointerWithVerticalSpeed(vSpeed));
  }


  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  build(): fabric.Group {
    // instrument background
    let background = this.service.createInstrumentBackGround(this.instrumentWidth, this.instrumentHeight, 'gray');

    // scale
    this.verticalScaleGroup = this.service.createVerticalScale(this.instrumentHeight, this.markList);
    this.verticalScaleGroup.width = this.instrumentWidth;
    this.verticalScaleGroup.height = this.instrumentHeight;

    // pointer
    this.pointer = this.service.createPointer(this.pointerSize);
    this.verticalScaleGroup.add(this.pointer);

    // instrument container
    this.vsiContainer =  new fabric.Group( [
      background,
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
      this.pointer.top = this.calculatePointerPositionFromVSpeed(vSpeed) + this.pointerSize/2;
      this.pointer.fill = this.updatePointerColor(vSpeed);
      this.updateView()
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
    if (vSpeed > 2000) {
      return 'black';
    } else if (vSpeed >= 1000) {
      return 'red';
    } else if (vSpeed >= -1000) {
      return 'green';
    } else if (vSpeed < -1000 && vSpeed > -2000) {
      return 'red';
    } else {
      return 'black';
    }
  }

  private updateView() {
    this.pointer.dirty = true;
    this.verticalScaleGroup.dirty = true;
    this.vsiContainer.dirty = true;
    this.canvas.requestRenderAll()
  }
}
