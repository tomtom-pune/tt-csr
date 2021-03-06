import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import tt from '@tomtom-international/web-sdk-maps';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit {
  map = null;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.map = tt.map({
      key: 'b5w0ip0dC0PPuyZ75hbmUPBcQK7IhO0V',
      container: 'map',
      style: 'tomtom://vector/1/basic-main',
    });
    this.map.addControl(new tt.NavigationControl());
    this.map.addControl(
      new tt.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    // this.getKitchenDetails();
    this.getSheetData().subscribe((resp) => {
      // console.log(resp);
      const features = [];
      resp.forEach((element) => {
        console.log(element);
        const feature = {
          type: 'Feature',
          geometry: {
            type: 'point',
            coordinates: [element.longitude, element.latitude],
          },
        };
        features.push(feature);
      });
      const featureCollection = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features,
        },
      };
      const layerName = 'kitchen';
      // if (this.map.getSource(layerName)) {
      //   this.map.getSource(layerName).setData(featureCollection);
      // } else {
      //   this.map.addSource(layerName, featureCollection);
      // }
      this.map.on('load', function() {
        this.map.addSource(layerName, featureCollection);
        this.map.addLayer({
          id: 'population',
          type: 'circle',
          source: layerName,
          paint: {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
              base: 1.75,
              stops: [
                [12, 2],
                [22, 180],
              ],
            },
            // color circles by ethnicity, using a match expression
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            'circle-color': [
              'match',
              ['get', layerName],
              'White',
              '#fbb03b',
              'Black',
              '#223b53',
              'Hispanic',
              '#e55e5e',
              'Asian',
              '#3bb2d0',
              /* other */ '#ccc',
            ],
          },
        });
      });
    });
  }

  public getKitchenDetails() {
    const url =
      'https://docs.google.com/spreadsheets/d/1rjxzB6Fkwu7Irz8uyXgS4OrqVMwNkdilXpxMGIjmOEo/edit?usp=sharing';
    this.http.get(url).subscribe((resp) => {
      console.log(resp);
    });
  }

  public getSheetData(): Observable<any> {
    const sheetId = '15Kndr-OcyCUAkBUcq6X3BMqKa_y2fMAXfPFLiSACiys';
    // const url = `https://spreadsheets.google.com/feeds/list/${sheetId}/od6/public/values?alt=json`;
    const url =
      'https://spreadsheets.google.com/feeds/list/1dlbj_KA5847UGjqHxCwZ3uDGNYo2sirros7sBaBcttM/od6/public/values?alt=json';

    return this.http.get(url).pipe(
      map((res: any) => {
        const data = res.feed.entry;

        const returnArray: Array<any> = [];
        if (data && data.length > 0) {
          data.forEach((entry) => {
            const obj = {};
            for (const x in entry) {
              if (x.includes('gsx$') && entry[x].$t) {
                obj[x.split('$')[1]] = entry[x]['$t'];
              }
            }
            returnArray.push(obj);
          });
        }
        return returnArray;
      })
    );
  }
}
