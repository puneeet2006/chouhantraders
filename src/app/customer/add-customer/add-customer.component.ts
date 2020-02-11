import { Component, OnInit ,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup,Validators,NgForm,AbstractControl,ValidationErrors,AsyncValidatorFn} from '@angular/forms';
import {Customer} from '../customer';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import {map,debounceTime,take} from 'rxjs/operators'
import {MatSnackBar} from '@angular/material/snack-bar';
import {CustomersService} from '../../services/customers.service';
//adding custom validation
function mobileNoLength(c:AbstractControl):{[key:string]:boolean} | null{
	if(c.value.length != 10)
	{
		return{'mobLength':true};
	}
	return null;
}

export class userExists{
	static mobno(afs:AngularFirestore){
		return (control:AbstractControl) =>{
			const mobno = control.value;
			
			return afs.collection('customer', ref => ref.where('mobile','==',mobno)).valueChanges().pipe(
				debounceTime(500),
				take(1),
				map(arr=>arr.length ? {'usernameAvailable':true}:null),
				);
		}
	}
}


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})


export class AddCustomerComponent implements OnInit {

	@ViewChild('formDirective',null) private formDirective: NgForm;

	nameErrMessage:string;
	addressErrMessage:string;
	mobileErrMessage:string;
	altmobileErrMessage:string;
	cityErrMessage:string;

	private validationMessages = {
		name : {
			required:'Name field is required',
			minlength:'Name must be longer than 3 characters '
		},
		address :{
			required:'Address field is required',
			maxlength:'Address field must not be longer than 50 char '
		},
		mobile:{
			required:'Please enter mobile number.',									
			mobLength:'The mobile must be of 10 digits.'
		},
		altmobile:{									
			mobLength:'The mobile must be of 10 digits.'
		},
		city:{
			required:'City is required',
		}


	};

	customerForm : FormGroup;

	customer = new Customer();
  	cust: Customer[];
  	custSaveStatus:boolean = false;
  	custSaveText:string = 'Save';

  constructor(private custFB : FormBuilder, private afs:AngularFirestore,private _snackBar: MatSnackBar,private custService:CustomersService) { }

  ngOnInit() {
  	this.createCustomerForm();
  	const nameControl = this.customerForm.get('name');
  	const addressControl = this.customerForm.get('address');
  	const mobileControl = this.customerForm.get('mobile');
  	const altmobileControl = this.customerForm.get('altmobile');
  	const cityControl = this.customerForm.get('city');
  	nameControl.valueChanges.pipe(debounceTime(1000)).subscribe(
  		value=> this.setErrorMessage('name',nameControl)
  	);

  	addressControl.valueChanges.pipe(debounceTime(1000)).subscribe(
  		value=> this.setErrorMessage('address',addressControl)
  	);

  	mobileControl.valueChanges.pipe(debounceTime(1000)).subscribe(
  		value=> this.setErrorMessage('mobile',mobileControl)
  	);

  	altmobileControl.valueChanges.pipe(debounceTime(1000)).subscribe(
  		value=> this.setErrorMessage('altmobile',altmobileControl)
  	);

  	cityControl.valueChanges.pipe(debounceTime(1000)).subscribe(
  		value=> this.setErrorMessage('city',cityControl)
  	);



  }

  setErrorMessage(type,c:AbstractControl):void{
  	//
  	this.mobileErrMessage = '';
  	if((c.touched || c.dirty && c.errors)){
  		switch (type) {
  			case "name":
  			{
  				this.nameErrMessage = '';
		  		if(c.errors)
		  		this.nameErrMessage = Object.keys(c.errors).map(key=>this.validationMessages.name[key]).join(' ');
  				break;
  			}
  			case "address":
  			{
  				this.addressErrMessage = '';
		  		if(c.errors)
		  		this.addressErrMessage = Object.keys(c.errors).map(key=>this.validationMessages.address[key]).join(' ');
  				break;
  			}
  			case "mobile":
  			{
  				this.mobileErrMessage = '';
		  		if(c.errors)
		  		this.mobileErrMessage = Object.keys(c.errors).map(key=>this.validationMessages.mobile[key]).join(' ');
  				break;
  			}
  			case "altmobile":
  			{
  				this.altmobileErrMessage = '';
		  		if(c.errors)
		  		this.altmobileErrMessage = Object.keys(c.errors).map(key=>this.validationMessages.altmobile[key]).join(' ');
  				break;
  			}
  			case "city":
  			{
  				this.cityErrMessage = '';
		  		if(c.errors)
		  		this.cityErrMessage = Object.keys(c.errors).map(key=>this.validationMessages.city[key]).join(' ');
  				break;
  			}
  			default:
  				null;
  			break;
  		}
  	
  	}
  }

  createCustomerForm()
  {
  	this.customerForm = this.custFB.group({
  		name : ['',[Validators.required,Validators.minLength(3)]],
  		mobile:['',[Validators.required,mobileNoLength],userExists.mobno(this.afs)],
  		altmobile:['',[Validators.minLength(10),Validators.maxLength(10)]],
  		address:['',[Validators.required,Validators.maxLength(50)]],
  		city:['',[Validators.required]],
  	});
  }

  resetCustomerForm()
  {
  	this.customerForm.setValue({
  		name:'pkw',
  		mobile:'9907053804',
  		altmobile:'',
  		address:'sdfdsf',
  		city:'fdsfsd'
  	})
  }

  async saveCustomer()
  {
  	let custData = this.customerForm.value;
  	this.custSaveText = 'Saving...';
  	this.custSaveStatus = true;


  	await this.afs.collection<Customer>('customer').add(custData).then(docRef=>{
  		 this._snackBar.open('Customer added successfully');
  		 this.custSaveText = 'Save';
  		 this.custSaveStatus = false;
  		 this.formDirective.resetForm();

  	})
  	.catch(error=>{
  		 this._snackBar.open('Error adding Customer. Try again later');
  		 this.custSaveText = 'Save';
  		 this.custSaveStatus = false;
  	})
  	
  }

}
