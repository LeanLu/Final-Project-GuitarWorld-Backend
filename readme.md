# 🎸**Guitar World** 🤘

## 💾 **Backend** 💽

### **Description:**

Backend of a guitars e-commerce project.
Users are required to register and log in to use the application.
Once logged in, they can view all the guitars, filter them by categories, add or remove them from their shopping cart and view the guitar details on a specific page.
There is an Admin role which can create, edit and delete the guitars.

The project was developed using [Node.js](https://nodejs.org/es/) with the [Express](https://expressjs.com/) framework and [Typescript](https://www.typescriptlang.org/).
The database used was [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) library.
Unit tests were performed using [Jest](https://jestjs.io/) and integration tests were conducted with [Supertest](https://github.com/ladjs/supertest).
Additionally, [Postman](https://www.postman.com/) was used for functional testing as well and [Render](https://render.com/) to deploy the backend.

<p align="left">
  <a href="https://developer.mozilla.org/en-US/">
    <img src="https://skillicons.dev/icons?i=nodejs,express,ts,mongodb,jest,postman"/>
  </a>
</p>

<br>
<br>

### **Endpoints:**

**'/users’:**

- **.post(’/users/register’)** → User register.
- **.post(’/users/login’)** → User login.
- **.get(’/users/:idUser’)** → Load one user. Need to be logged in.
- **.patch(’/users/add/cart/:idGuitar’)** → Add guitars to shopping cart. Need to be logged in.
- **.patch(’/users/remove/cart/:idGuitar’)** → Remove guitars to shopping cart. Need to be logged in.

**‘/guitars’:**

- **.get(’/guitars/products?style=&page=’)** → Get guitars by style and page. Need to be logged in.
- **.get(’/guitars/details/:idGuitar’)** → Load guitar's details. Need to be logged in.
- **.post(’/guitars/create’)** → Create a new guitar. Only for Admin.
- **.patch(’/guitars/edit/:idGuitar’)** → Edit a guitar. Only for Admin
- **.delete(’/guitars/delete/:idGuitar’)** → Delete a guitar. Only for Admin
  <br>
  <br>

### **Data model:**

- **User:**

  - id: `string`
  - username: `string`
  - email: `string`
  - password: `string`
  - role: `string`
  - myGuitars: `Guitar[ ]`
    <br>
    <br>

- **Guitar:**
  - id: `string`
  - brand: `string`
  - modelGuitar: `string`
  - picture: `string`
  - style: `string`
  - material: `string`
  - price: `number`
  - description: `string`
    <br>
    <br>

### **How to use it:**

- Fork the project.
- Clone it to work in local.
- Install dependencies: `npm i`.
- Follow the `sample.env` instructions in order to connect the server with your MongoDB account.
- Leave a terminal compiling: `npm run build`.
- Start the server in other terminal: `npm run start:mon`
- Enjoy it.
  <br>
  🥳

<br>
<br>

![guitar-world-logo](https://t3.ftcdn.net/jpg/01/70/12/02/360_F_170120287_OqdsKQSUsa5ro0uCOMVEteoZkaMJQvue.webp)
