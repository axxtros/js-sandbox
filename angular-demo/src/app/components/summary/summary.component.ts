import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { StocksService } from '../../services/stocks.service';

@Component({
  selector: 'summary1',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  @Input() stock: any;
  @Input() name: any;

  summaryTitle = "This is a summary title!";
  //stock: any;
  //name: string;  

  constructor(/*service: StocksService*/) {
    //this.stock.add('aaaa');    
    //this.stock = service;        
   }

  ngOnInit(): void {
  }

  isNegative() {
    return (this.stock && this.stock.change < 0);
  }

  isPositive() {
    return (this.stock && this.stock.change > 0); 
  }

}
