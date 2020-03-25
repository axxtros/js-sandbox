//ng --version

//Getting Started with Node.js, Angular, and Visual Studio Code
//https://devblogs.microsoft.com/premier-developer/getting-started-with-node-js-angular-and-visual-studio-code/
//ng serve (http://localhost:4200)
//ng generate service services/stocks

//Angular JS in Visual Studio Code
//https://code.visualstudio.com/docs/nodejs/angular-tutorial

//project file structure descriptions
//https://angular.io/guide/file-structure

//routing
//https://angular.io/start/start-routing
//https://angular.io/tutorial/toh-pt5       (ebből, és a könyv példájából tettem össze (AngularJS in Action))

//component example
//https://stackoverflow.com/questions/43638326/angular-2-component-not-displaying-in-index-html

//interfaces example
//https://medium.com/hackernoon/creating-interfaces-for-angular-services-1bb41fbbe47c

//add FormsModule with ngModel
//https://stackoverflow.com/questions/38892771/cant-bind-to-ngmodel-since-it-isnt-a-known-property-of-input

//MEAN.JS tutorials
//https://medium.com/@ariana10andrason/mean-stack-feature-and-architecture-e70409d18337
//https://www.tutorialspoint.com/meanjs/meanjs_building_spa_next_level.htm

//How to Post FormData (multipart/form-data) with Angular 9/8, TypeScript and HttpClient
//https://www.techiediaries.com/angular-formdata/

//Http POST to Node/Express.js Example
//https://www.techiediaries.com/angular/angular-9-http-post-node-express-example/

//működő POST kérés expressjs-nek
//https://stackoverflow.com/questions/46714480/httpclient-post-request-using-x-www-form-urlencoded
//https://www.itsolutionstuff.com/post/angular-8-httpclient-for-sending-http-request-exampleexample.html

import { Component } from '@angular/core';
import { StocksService, StockInterface } from './services/stocks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  stocks: Array<StockInterface>;

  constructor(service: StocksService) {
    service.load(['AAPL']).subscribe(stocks => {this.stocks = stocks;});
  }

  title = 'Angular Demo is running...';
  valami = 'This line come from typescript code. :)';
};