import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { StocksService } from '../../services/stocks.service';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  symbols: Array<string>;
  @Input() stock: any;
  @Input() firstName: any;

  constructor(private service: StocksService, private authService: AuthService) {
    this.symbols = service.get();
   }

  ngOnInit(): void {
  }

  add() {  
      
    this.authService.sendToExpressServer(this.firstName);    

    //console.log('firstname: ' + this.firstName);
    this.symbols = this.service.add(this.firstName.toUpperCase());
    this.firstName = '';
  }

  remove(symbol) {
    this.symbols = this.service.remove(symbol);
  }

}
