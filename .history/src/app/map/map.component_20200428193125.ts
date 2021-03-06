import { Component, OnInit } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map = null;
  constructor() { }

  ngOnInit() {
    this.map = tt.map({
      key: 'b5w0ip0dC0PPuyZ75hbmUPBcQK7IhO0V',
      container: 'map',
      style: 'tomtom://vector/1/basic-main'
      // dragPan: !tt.isMobileOrTablet()
    });
    this.map.addControl(new tt.FullscreenControl());
    this.map.addControl(new tt.NavigationControl());
  }

}
