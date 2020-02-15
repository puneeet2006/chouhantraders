import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import {ProductsService} from '../../services/products.service';
import  {IProducts} from '../../models/products';
import { Observable } from 'rxjs';
import {map,debounceTime,take} from 'rxjs/operators';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from "@angular/router"


@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  paymentFormGroup: FormGroup;
  grandTotalStatus = true;
  orderID: string;
  pendingStatus: boolean = false;
  pendingDueStatus: boolean = false;

  summaryBtnStatus = false;
  summaryBtnText = 'Place Order';

  paymentBtnText = 'Payment Save';
  paymentBtnStatus = false;
 

  customer:Array<any> = [];
  custBtnStatus:boolean = true;
  products$:Observable<IProducts[]>;
  
 
	

   sellFormProps=[];
   productdata=[];

   productMainKeys = [];

   summary={};

   private sellFormDataObj = {};

   private formGroupObj = {};

   grandTotal = 0;

   private sellObj = {
   	quantity:'',
   	price:''
   }

   sellArr = ['quantity','price'];

  constructor(private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private prodService: ProductsService, private afs: AngularFirestore, private router: Router) { }

  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });


    this.secondFormGroup = this._formBuilder.group({
      
    });

    this.createpaymentForm();
   this.products$ = this.prodService.getProducts();

   
   this.prodService.getProducts().subscribe(
   	items=> {
   		this.productdata =items;
   		this.productMainKeys =  this.productdata.map(item=>{
   			let obj = {}
   			obj['id'] = item.id;
   			obj['mass'] = item.mass;
   			obj['total'] = 0;
   			obj['quantity'] = 0;
   			obj['price'] = 0;
   			return obj;
   		})

   		console.log(this.productMainKeys);

   		let arr={};
   		for (const propMain of this.productMainKeys){
   		
	   		for (const prop of Object.keys(this.sellObj)){
	   			this.sellFormDataObj[propMain.id+'_'+prop] = new FormControl(0); 
	   			
	   		}
	   		arr[propMain.id] = this.sellFormDataObj;
	   		this.sellFormDataObj = {};
 
	   		
   	}

   	this.sellFormDataObj = arr;

   
   		
   		for (const prop of this.productMainKeys)
   		{
   			
   			this.formGroupObj[prop.id] = new FormGroup(this.sellFormDataObj[prop.id])
   		}
   		this.secondFormGroup = this._formBuilder.group(this.formGroupObj);

   		
   });




   /*this.prodKeys = this.products$.pipe(
   		map(products=>
   			products.map(product=>({
   				...product,
   				qtyModal:product.id+'_qty',
   				priceModal:product.id+'_price'
   			})
			)
   		)
   	)*/
  }

    calcPrice(evt,id){
   	let value = evt.target.value;
   	let prodid = id;
   	let totalArr = [];

   	this.productMainKeys.forEach(item=>{
   		if(item.id == id)
   		{
   				let valArr = [];
   				let formObj = this.secondFormGroup.get(id).value;
   				for (var key in formObj) {
				  if (formObj.hasOwnProperty(key)) {
				 	let qty = prodid+'_quantity';
				 	let price = prodid+'_price';

				 	item.quantity = formObj[qty];
				 	item.price = formObj[price];

				    valArr.push(formObj[key]); 
				  }
				}
   				item.total = valArr.reduce( (a,b) => a * b );
   				
   		}

   		totalArr.push(item.total);
   	})

   this.grandTotal = totalArr.reduce((a,b)=>a+b);

    if (this.grandTotal > 0)
      this.grandTotalStatus = false;
    else
      this.grandTotalStatus = true;
   }



  async saveProductSell(stepper) {
     this.summaryBtnStatus = true;
     this.summaryBtnText = 'Placing Order';
    let buildSellData:{};
    const customerId = this.customer['id'];
    console.log(customerId);
    let sellData = this.productMainKeys;
     buildSellData = {
       customer_id : customerId,
       product_details : sellData,
       grandTotal: this.grandTotal,
       date: new Date(),
     }

     await this.afs.collection<any>('orders').add(buildSellData).then(docRef => {
        this.orderID = docRef.id;
       this._snackBar.open('Order added successfully');
       this.summaryBtnText = 'Order Placed,';
     this.goForward(stepper);

     })
       .catch(error => {
         this._snackBar.open('Error adding Order. Try again later');
         this.summaryBtnText = 'Error Placing order';
        
       })
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

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  createpaymentForm() {
    this.paymentFormGroup = this._formBuilder.group({
    full_paid: [''],
    amount_paid: [''],
    pending_amount: [''],
    next_payment: [''],
     

    });

    const fullPaymentControl = this.paymentFormGroup.get('full_paid');
    const amountPaidControl = this.paymentFormGroup.get('amount_paid');

    amountPaidControl.valueChanges.pipe(debounceTime(500)).subscribe(
      value => {
        
      let paidAmount = value;
      let pendingAmount = this.grandTotal - value;
      this.paymentFormGroup.patchValue({ 'pending_amount': pendingAmount });
         
        
      }
    );

    fullPaymentControl.valueChanges.subscribe(
      value => {
        if(value == true)
        {
          this.paymentFormGroup.patchValue({ 'amount_paid': this.grandTotal });
          this.pendingStatus = true;
          this.pendingDueStatus = true;
             }
        else
        {
          this.paymentFormGroup.patchValue({ 'amount_paid': 0 ,'pending_amount':0});
          this.pendingStatus = false;
          this.pendingDueStatus = false;

              }
      }
    );
  }

  async savePayment()
  {
    this.paymentBtnText = 'Payment Saving...';
    this.paymentBtnStatus = true;
    const orderId = this.orderID;
    const userId = this.customer['id'];
    const formData = this.paymentFormGroup.value;
   


   const buildPaymentObject  = {
     order_id :orderId,
     user_id:userId,
     amount_paid: formData.amount_paid,
     pending_amount : formData.pending_amount,
     next_payment : formData.next_payment
   }

    await this.afs.collection<any>('transaction').add(buildPaymentObject).then(docRef => {
      this.orderID = docRef.id;
      this._snackBar.open('Payment Details added successfully');
      this.paymentBtnText = 'Payment Save';
    this.paymentBtnStatus = false;
    this.router.navigate(['/welcome']);

    })
      .catch(error => {
        this._snackBar.open('Error adding payment detail. Try again later');
       

      })
  }

  
  /*async saveStock:void()
  {
    let stockData = this.stockForm.value;
    this.stockSaveText = 'Saving...';
    this.stockSaveStatus = true;


    await this.afs.collection<IStock>('stock').add(stockData).then(docRef=>{
       this._snackBar.open('Stock added successfully');
       this.stockSaveText = 'Save';
       this.stockSaveStatus = false;
       this.formDirective.resetForm();

    })
    .catch(error=>{
       this._snackBar.open('Error adding Customer. Try again later');
       this.stockSaveText = 'Save';
       this.stockSaveStatus = false;
    })
  }*/
}
