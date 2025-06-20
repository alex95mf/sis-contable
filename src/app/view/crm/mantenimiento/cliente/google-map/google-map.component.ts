import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
declare var google: any;
@Component({
standalone: false,
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit, OnChanges {
  @Input() initialLat: number = -2.147866;
  @Input() initialLng: number = -79.922742;
  @Input() initialZoom: number = 12;

  selectedLat: number = 0;
  selectedLng: number = 0;

  @Output() coordinatesChanged = new EventEmitter<{ lat: number, lng: number }>();

  private map: any | undefined;
  private marker: any | undefined;

  ngOnInit(): void {
    this.loadGoogleMapsScript();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.initialLat || changes.initialLng) {
      this.updateMarkerPosition();
    }
  }

  private loadGoogleMapsScript() {
    if (document.getElementById('google-maps-script')) {
      this.initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA8Az-fACp3ukURt5H5bUoz5bI-g0Ax5V4`;
    script.async = true;
    script.defer = true;

    script.addEventListener('load', () => {
      this.initializeMap();
    });

    document.body.appendChild(script);
  }

  private initializeMap() {
    const mapElement = document.getElementById('google-map');
    if (!mapElement) {
      console.error('Elemento #google-map no encontrado.');
      return;
    }

    const mapOptions: any = {
      center: { lat: this.initialLat, lng: this.initialLng },
      zoom: this.initialZoom
    };

    this.map = new google.maps.Map(mapElement, mapOptions);

    this.marker = new google.maps.Marker({
      position: { lat: this.initialLat, lng: this.initialLng },
      map: this.map,
      title: 'Coordenadas iniciales'
    });

    this.map.addListener('click', (event) => {
      this.selectedLat = event.latLng.lat();
      this.selectedLng = event.latLng.lng();
      this.coordinatesChanged.emit({ lat: this.selectedLat, lng: this.selectedLng });

      // Actualiza la posición del marcador al hacer clic en el mapa
      if (this.marker) {
        this.marker.setPosition(event.latLng);
      }

      console.log(`Coordenadas seleccionadas: ${this.selectedLat}, ${this.selectedLng}`);
    });
  }

  private updateMarkerPosition() {
    if (this.map && this.marker) {
      const newPosition = { lat: this.initialLat, lng: this.initialLng };
      this.marker.setPosition(newPosition);
      this.map.setCenter(newPosition);
      this.map.setZoom(this.initialZoom);
    }
  }
}


// import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

// @Component({
// standalone: false,
//   selector: 'app-google-map',
//   templateUrl: './google-map.component.html',
//   styleUrls: ['./google-map.component.css']
// })
// export class GoogleMapComponent implements OnInit, OnChanges {
//   @Input() initialLat: number = -2.147866;
//   @Input() initialLng: number = -79.922742;
//   selectedLat: number = 0;
//   selectedLng: number = 0;

//   @Output() coordinatesChanged = new EventEmitter<{ lat: number, lng: number }>();

//   private map: any | undefined;
//   private marker: any | undefined;

//   ngOnInit(): void {
//     this.loadGoogleMapsScript();
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes.initialLat || changes.initialLng) {
//       this.updateMarkerPosition();
//     }
//   }

//   private loadGoogleMapsScript() {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA8Az-fACp3ukURt5H5bUoz5bI-g0Ax5V4&callback=initMap`;
//     script.async = true;
//     script.defer = true;
//     script.addEventListener('load', () => {
//       this.initializeMap();
//     });
//     document.body.appendChild(script);
//   }

//   private initializeMap() {
//     const mapElement = document.getElementById('google-map');
//     if (!mapElement) {
//       console.error('Elemento #google-map no encontrado.');
//       return;
//     }

//     const mapOptions: any = {
//       center: { lat: this.initialLat, lng: this.initialLng },
//       zoom: 12
//     };

//     this.map = new google.maps.Map(mapElement, mapOptions);

//     this.marker = new google.maps.Marker({
//       position: { lat: this.initialLat, lng: this.initialLng },
//       map: this.map,
//       title: 'Coordenadas iniciales'
//     });

//     this.map.addListener('click', (event) => {
//       this.selectedLat = event.latLng.lat();
//       this.selectedLng = event.latLng.lng();
//       this.coordinatesChanged.emit({ lat: this.selectedLat, lng: this.selectedLng });

//       // Actualiza la posición del marcador al hacer clic en el mapa
//       if (this.marker) {
//         this.marker.setPosition(event.latLng);
//       }

//       console.log(`Coordenadas seleccionadas: ${this.selectedLat}, ${this.selectedLng}`);
//     });
//   }

//   private updateMarkerPosition() {
//     if (this.map && this.marker) {
//       const newPosition = { lat: this.initialLat, lng: this.initialLng };
//       this.marker.setPosition(newPosition);
//       this.map.setCenter(newPosition);
//     }
//   }
// }



// // google-map.component.ts
// import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

// @Component({
// standalone: false,
//   selector: 'app-google-map',
//   templateUrl: './google-map.component.html',
//   styleUrls: ['./google-map.component.css']
// })
// export class GoogleMapComponent implements OnInit {

//  // initialLat = -2.145357;
//   //initialLng = -79.901385;

//   @Input() initialLat: number = -2.145357;
//   @Input() initialLng: number = -79.901385;

//   selectedLat: number=0;
//   selectedLng: number=0;

//   @Output() coordinatesChanged = new EventEmitter<{ lat: number, lng: number }>();
//   private map: any | undefined;
//   private marker: any | undefined;


//   ngOnInit(): void {
//     this.loadGoogleMapsScript();
//   }

//   private loadGoogleMapsScript() {
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA8Az-fACp3ukURt5H5bUoz5bI-g0Ax5V4&callback=initMap`;
//     script.async = true;
//     script.defer = true;
//     script.addEventListener('load', () => {
//       this.initializeMap();
//     });
//     document.body.appendChild(script);
//   }
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes.initialLat || changes.initialLng) {
//       this.updateMarkerPosition();
//     }
//   }
//   private updateMarkerPosition() {
//     if (this.map && this.marker) {
//       const newPosition = { lat: this.initialLat, lng: this.initialLng };
//       this.marker.setPosition(newPosition);
//       this.map.setCenter(newPosition);
//     }
//   }

//   private initializeMap() {
//     const mapElement = document.getElementById('google-map');
//     if (!mapElement) {
//       console.error('Elemento #google-map no encontrado.');
//       return;
//     }

//     const mapOptions: any = {
//       center: { lat: this.initialLat, lng: this.initialLng },
//       zoom: 12
//     };

//     const map = new google.maps.Map(mapElement, mapOptions);

//     const initialMarker = new google.maps.Marker({
//       position: { lat: this.initialLat, lng: this.initialLng },
//       map,
//       title: 'Coordenadas iniciales'
//     });

//     map.addListener('click', (event) => {
//       this.selectedLat = event.latLng.lat();
//       this.selectedLng = event.latLng.lng();
//       this.coordinatesChanged.emit({ lat: this.selectedLat, lng: this.selectedLng });

//       console.log(`Coordenadas seleccionadas: ${this.selectedLat}, ${this.selectedLng}`);
//     });
//   }
// }
