import { Component, OnInit } from '@angular/core';
import {ProductsService} from '../../services/products.service';

import  {IProducts} from '../../models/Products';
@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.scss']
})
export class ListproductComponent implements OnInit {

  constructor(private productService: ProductsService) { }
  products:IProducts[];
  ngOnInit() {
	this.productService.getProducts().subscribe(items=>{
      this.products = items;
      console.log(items);
    });
  }

}
