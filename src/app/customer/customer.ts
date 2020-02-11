export class Customer
{
	constructor(
		public name?: string,
		public mobile? : number,
		public altnumber? : number,
		public address?: string,
		public city?:string 
	){}
}

export interface ICustomer {
  name: string;
  mobile: number;
  altmobile: string;
  address:string;
  city:string;
  id:string
}