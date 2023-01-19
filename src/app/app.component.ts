import {Component, OnInit} from '@angular/core';
import { fabric } from 'fabric';
import {FabricBuilderService} from "./service/fabric-builder.service";
import {DataService} from "./service/data.service";
import {VerticalSpeedIndicatorService} from "./service/instruments/vertical-speed-indicator.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  canvas: fabric.Canvas;

  canvasWidth = 800;
  canvasHeight = 500;

  constructor(private readonly service: FabricBuilderService,
              private readonly dataService: DataService,
              private readonly verticalSpeedIndicator: VerticalSpeedIndicatorService) {
  }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('PFD_canvas');
    this.buildBackground()
    this.buildVerticalIndicatorSpeed();
    this.canvas.renderAll()
  }

  buildBackground() {
    const strokeWidth = 5;
    let background = new fabric.Group( [new fabric.Rect({
      fill: '#8FAABA',
      width: this.canvasWidth - 2*strokeWidth,
      height: this.canvasHeight - 2*strokeWidth,
      stroke: "black",
      strokeWidth: strokeWidth,
      opacity: 0.5,
    })])
    this.canvas.add(background);
  }

  buildVerticalIndicatorSpeed() {
    this.verticalSpeedIndicator.setCanvas(this.canvas);
    this.canvas.add(this.verticalSpeedIndicator.build());
  }


}
