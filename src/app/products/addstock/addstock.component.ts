import { Component, OnInit ,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup,Validators,NgForm,AbstractControl} from '@angular/forms';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import {map,debounceTime,take} from 'rxjs/operators'
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProductsService} from '../../services/products.service';
import  {IStock} from '../../models/stock';
import  {IProducts} from '../../models/products';

@Component({
  selector: 'app-addstock',
  templateUrl: './addstock.component.html',
  styleUrls: ['./addstock.component.scss']
})
export class AddstockComponent implements OnInit {

  @ViewChild('formDirective',null) private formDirective: NgForm;

  stockSaveStatus:boolean = false;
  stockSaveText:string = 'Save';
  productMeasurement:string;

 
  constructor(private productService: ProductsService,private stockFB : FormBuilder, private afs:AngularFirestore,private _snackBar: MatSnackBar) { }

   products:IProducts[];
   stockForm : FormGroup;

  ngOnInit() {
  	this.productService.getProducts().subscribe(items=>{
        this.products = items;
      });

    this.createStockForm();

  }

  onProductSelected(event){
    const type = event.value;
    this.productMeasurement = this.products.find(product=>product.id === type).mass;
  }

  createStockForm()
  {
  	this.stockForm = this.stockFB.group({
  		billno : [''],
  		bilteryno : ['',[Validators.required]],
  		type : ['',[Validators.required]],
  		qunatity : ['',[Validators.required]],
  		price : ['',[Validators.required]],
  		date : ['',[Validators.required]],
  		
  	});
  }

  async saveStock()
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
  }
 

}
