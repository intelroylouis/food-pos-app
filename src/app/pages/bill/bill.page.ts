import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PrintService } from 'src/app/services/print.service';

// こちらのページやtsは現状使用していません。

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage implements OnInit {

  constructor(public location: Location, private printService: PrintService) { }

  ngOnInit() {
  }

  backToMenu(){
    this.location.back();
  }

  connectTest(){
    this.printService.connect();

  }

  printTest(){
    // this.printService.sendMessage();
  }

}
