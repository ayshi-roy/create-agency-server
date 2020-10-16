const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config()



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('client'));
app.use(fileUpload());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jmmpi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
    const ordersCollection = client.db("creativeAgency").collection("orderList");
    const clientCollection = client.db("creativeAgency").collection("ClientList");
    const adminCollection = client.db("creativeAgency").collection("AdminList");
    const serviceCollection = client.db("creativeAgency").collection("addServiceList");
  
    app.post('/addOrder', (req, res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders)
        .then(result => {          
            res.send(result.insertedCount > 0)
        })  
    })
    app.get('/orderlist', (req, res) => {    
      ordersCollection.find({email: req.query.email})
      .toArray((err, documents) => {
          res.send(documents);
      })
    })
    app.get('/allOrderList', (req, res) => {
      ordersCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
          })
    })

    app.post('/addReview', (req, res) => {
      const file = req.files.file;
      const name = req.body.name;
      const company = req.body.company;
      const detail = req.body.detail;
      const newImg = file.data;
      const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };     
      clientCollection.insertOne({ name, company,detail,image})
            .then(result => {
                res.send(result.insertedCount > 0);
            }) 
     })

     app.get('/clientlist', (req, res) => {
      clientCollection.find({})
      .toArray( (err, documents) => {
          res.send(documents);
      })
    })

      app.post('/addnewService', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;    
        const detail = req.body.detail;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

          var image = {
              contentType: file.mimetype,
              size: file.size,
              img: Buffer.from(encImg, 'base64')
          };    
          serviceCollection.insertOne({ name,detail,image})
              .then(result => {
                  res.send(result.insertedCount > 0);
              }) 
    })

    app.get('/serviceList', (req, res) => {
      serviceCollection.find({})
      .toArray( (err, documents) => {
          res.send(documents);
      })
    })  

  

  app.post('/makeAdmin', (req, res) => {
          const admin = req.body;
          adminCollection.insertOne(admin)
          .then(result => {          
              res.send(result.insertedCount > 0)
          })  
      })

    app.post('/isAdmin', (req, res) => {
      const email = req.body.email;     
      adminCollection.find({email: email})
      .toArray( (err, AdminList) => {
          res.send(AdminList.length > 0);
      })

    })

    console.log('connect');
  });


  app.get('/', (req, res) => {
      res.send('Hello World!')
    })
  
  app.listen(process.env.PORT);