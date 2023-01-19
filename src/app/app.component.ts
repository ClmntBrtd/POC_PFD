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
  group: fabric.Group;

  constructor(private readonly service: FabricBuilderService,
              private readonly dataService: DataService,
              private readonly verticalSpeedIndicator: VerticalSpeedIndicatorService) {
  }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('PFD_canvas');
    this.group = new fabric.Group( [new fabric.Rect({
      fill: 'green',
      width: 500,
      height: 500,
      borderColor: 'black',
      borderScaleFactor: 2,
    })])
    this.canvas.add(this.group);
    this.buildVerticalIndicatorSpeed();

  }

  buildVerticalIndicatorSpeed() {
    this.verticalSpeedIndicator.setCanvas(this.canvas);
    this.canvas.add(this.verticalSpeedIndicator.build());
  }


}
