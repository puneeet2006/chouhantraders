import { Component, OnInit } from '@angular/core';
import {CustomersService} from '../../services/customers.service';
import {ICustomer} from '../customer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.scss']
})
export class ListCustomersComponent implements OnInit {

  displayedColumns = [ 'name', 'mobile', 'altmobile','address','city','actions'];
  //dataSource:Observable<ICustomer[]>;
  filterList:ICustomer[];
  dataSource: ICustomer[];
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

}

