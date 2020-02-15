import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import {CustomersService} from '../../services/customers.service';
import { ICustomer } from '../../models/customer';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.scss']
})


export class ListCustomersComponent implements OnInit {

  @Output() public getUserData:EventEmitter<string> = new EventEmitter<string>();

  displayedColumns = [ 'name', 'mobile', 'altmobile','address','city','actions'];
  //dataSource:Observable<ICustomer[]>;
  filterList:ICustomer[];
  dataSource: ICustomer[];

  selectedCust:string;
  constructor(private customerService: CustomersService) { }
  ngOnInit() {
  	//this.dataSource = this.customerService.getCustomers();
  	this.customerService.getCustomers().subscribe(items=>{
      this.dataSource = items;
      this.filterList = this.dataSource;
    });
  }

   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
   
    this.filterList = filterValue ? this.performFilter(filterValue) : this.dataSource;
   	//this.dataSource = this.dataSource.filter(item=>console.log(item.name));
   	//console.log(this.dataSource)
  }

  performFilter(value:string):ICustomer[]
  {
  	value = value.toLowerCase();
  	return this.dataSource.filter((item:ICustomer)=>item.name.toLowerCase().indexOf(value) !== -1)
  }

  selectedCustomer(elem)
  {
    this.getUserData.emit(elem);
  }

}

