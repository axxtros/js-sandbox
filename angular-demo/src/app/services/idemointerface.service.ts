import { Injectable } from '@angular/core';

export interface IDemoInterface {
  title: String;
  age: number;
  isHuman: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IdemointerfaceService {

  constructor() { 
    //NOP
  }  

}
