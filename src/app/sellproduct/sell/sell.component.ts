import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductsService} from '../../services/products.service';
import  {IProducts} from '../../models/products';
import {map} from 'rxjs/operators'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  customer:Array<any> = [];
  custBtnStatus:boolean = true;
  products$:Observable<IProducts[]>;
  prodKeys;
  qtd:any[] =[{}];
  prc:any[] =[{}];

  constructor(private _formBuilder: FormBuilder,private prodService:ProductsService) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

   this.products$ = this.prodService.getProducts();

   this.prodKeys = this.products$.pipe(
   		map(products=>
   			products.map(product=>({
   				...product,
   				qtyModal:product.id+'_qty',
   				priceModal:product.id+'_price'
   			})
			)
   		)
   	)
  }

  public getData(value): void {
  	this.customer = value;
	  	if(this.customer)
	  	{
	  		this.custBtnStatus = false;
	  	}
	  	else
	  	{
	  		this.custBtnStatus = true;
	  	}
	}
}
