import { Component, OnInit } from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {StockService} from '../../services/stock.service';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import  {IProducts} from '../../models/Products';
import  {IStock} from '../../models/Stock';

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.scss']
})
export class ListproductComponent implements OnInit {

  constructor(private productService: ProductsService,private stockService: StockService) { }
  products$:Observable<IProducts[]>;
  stocks$:Observable<IStock[]>;
  productStock$:Observable<IProducts[]>;
  ngOnInit() {
    this.products$ = this.productService.getProducts();
	  this.stocks$ = this.stockService.getStock();

    this.productStock$ = combineLatest([
      this.products$,
      this.stocks$
      ]).pipe(
      map(([projects,stocks])=>
          projects.map(project =>({
             ...project,
             stock: stocks.find(stock=>stock.type == project.id)
          }) as IProducts)
        )
      );

      this.productStock$.subscribe(item=>{
        console.log(item);
      })

  }

}
