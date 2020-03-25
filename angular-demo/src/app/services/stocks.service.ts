import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

let stocks: Array<string> = ['John', 'Gabriel', 'Arnold', 'Jazmine', 'Crysannia'];
let service: string = 'https://angular2-in-action-api.herokuapp.com';

export interface StockInterface {
  symbol: string;
  lastTradePriceOnly: number;
  change: number;
  changeInPercent: number;
}

@Injectable({
  providedIn: 'root'
})

export class StocksService {

  constructor(private http: HttpClient) { 
    //NOP
  }

  get() {
    return stocks.slice();
  }

  getFirst() {
    return stocks[0];
  }

  getStocksSize() {
    return stocks.length;
  }

  getStock(element) {
    return stocks[element];
  }

  add(stock) {
    stocks.push(stock);
    return this.get();
  }

  remove(stock) {
    stocks.splice(stocks.indexOf(stock), 1);
    return this.get();
  }

  load(symbols) {
    if (symbols) {
      return this.http.get<Array<StockInterface>>(service + '/stocks/snapshot?symbols=' + symbols.join());
    }
  }

}
