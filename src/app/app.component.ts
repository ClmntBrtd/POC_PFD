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

  testLine: fabric.Line;

  constructor(private readonly service: FabricBuilderService,
              private readonly dataService: DataService,
              private readonly verticalSpeedIndicator: VerticalSpeedIndicatorService) {
  }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('PFD_canvas');
    this.buildBackground()
    this.buildVerticalIndicatorSpeed();
    this.test();
    this.canvas.renderAll()

    this.dataService.getVerticalSpeed$().subscribe(v => this.testUpdate(v))
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




  test() {
    // this.testLine = new fabric.Line([0, 0, 150, 150]);
    // this.testLine.stroke = 'red';
    // this.canvas.add(this.testLine, new fabric.Line([0, 0, 150, 150], {stroke: 'blue'}))
    //
    // const poly = new fabric.Polygon([{x:100, y:200}, {x:100, y:300}, {x:200, y:200}, {x:200, y:100}])
    // this.canvas.add(poly)
  }

  testUpdate(v : number) {
    // let toto = this.canvas.getObjects('line')
    //
    // this.testLine.x1 = v / 20
    // this.testLine.x2 = v / 10;
    // this.testLine.width = this.testLine.x2 - this.testLine.x1
    // this.testLine.dirty = true;
    // this.testLine.setCoords()
    // this.canvas.renderAll()
  }


}
