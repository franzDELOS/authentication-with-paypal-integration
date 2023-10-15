# Authentication with Paypal Integration #

## Requirements ##
*Node Js v18.17.0 <br>
*Next 13.5.4 <br>
* MySQL  //I use Xampp <br>
//Other dependencies you can see it in package.json file

### FrontEnd ###

1. In the terminal  <br>
`cd client`

2. _Create a `.env` file and add this_ <br> `NEXT_PUBLIC_API_BASE_URL=http://localhost:8081`

3. _install dependencies_ <br>
`npm install`

visit url: http://localhost:3000/login

### BackEnd ###

1. In the terminal  <br>
`cd server`

2. _Create a `.env` file and add this_ <br>
//Add your database connection <br>
   DB_HOST="" <br>
DB_USER="" <br>
DB_PASSWORD="" <br>
DB_DATABASE=""  <br>
//Port to use <br>
PORT = 8081 <br>
//Secret key for Paypal Integration <br>
PAYPAL_CLIENT_ID="AXRnjWRmCxL-tlyGShi5ZIcxoJdiuzFx978RlrU9uC9-CFyax4MHicWRlxoWzBAbqm57Ly2hf_PCRdh1" <br>
PAYPAL_CLIENT_SECRET="EFdZPPjpYCXB8MRxBZWW-YrSJtbVAQh1MGMRQP5b9jPP7QYt70AUjNtVLB0mxcng0W4cFrkKcaDLNCcv"

3. _install dependencies_ <br>
`npm install`


## Proofs ##
![3](https://github.com/franzDELOS/authentication-with-paypal-integration/assets/108921882/76402049-7ee1-4901-885f-db739f924635)
![4](https://github.com/franzDELOS/authentication-with-paypal-integration/assets/108921882/f4b1a462-fb9c-4d7c-bd3f-0dc3e0dd14c2)




