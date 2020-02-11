import { Component,OnInit } from '@angular/core';
import {ProductsService} from './services/products.service';

import  {IProducts} from './models/Products';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Chouhan Traders';
  products:IProducts[];

  constructor(private productService: ProductsService){}

  ngOnInit(){
    /*this.productService.getProducts().subscribe(items=>{
      this.products = items;
       console.log(this.products)

    });*/
   
  }

}

/*
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-analytics.js"></script>

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBDg2qnBXyX_MdKoKW1RgUbtfe9sc0Cnzk",
    authDomain: "chouhantradersdewas.firebaseapp.com",
    databaseURL: "https://chouhantradersdewas.firebaseio.com",
    projectId: "chouhantradersdewas",
    storageBucket: "chouhantradersdewas.appspot.com",
    messagingSenderId: "486304802927",
    appId: "1:486304802927:web:44bccee401b8a4d554c59a",
    measurementId: "G-X15F1WKWWR"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>
*/