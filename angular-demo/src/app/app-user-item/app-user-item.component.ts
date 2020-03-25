import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { StockInterface } from '../services/stocks.service';
import { StocksService } from '../services/stocks.service';

@Component({
  selector: 'app-app-user-item',
  templateUrl: './app-user-item.component.html',
  styleUrls: ['./app-user-item.component.css']
})

export class AppUserItemComponent implements OnInit {

  @Input() stock: StocksService;

  valami = "Hello Valami!";
  color: string;
  stocFirst = this.getFirst();
  serviceFirst: string;

  constructor(service: StocksService) {
    this.color = "Red";
    this.serviceFirst = service.getFirst();
  }

  ngOnInit(): void {
  }

  getFirst() {
    return "első!!!!";
  }

}
