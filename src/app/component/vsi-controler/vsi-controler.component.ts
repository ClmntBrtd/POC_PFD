import {Component, EventEmitter, OnInit} from '@angular/core';
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-vsi-controler',
  templateUrl: './vsi-controler.component.html',
  styleUrls: ['./vsi-controler.component.scss']
})
export class VsiControlerComponent implements OnInit {

  value: number = 0;

  constructor(private readonly dataService: DataService) { }

  ngOnInit(): void {
  }

  speedChange(vSpeed: number) {
    this.value = vSpeed*1000
    this.dataService.setVerticalSpeed(this.value);
  }

}
