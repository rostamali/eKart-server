const express = require('express')
const app = express()
const port = process.env.PORT || 4000

const cors = require("cors");
app.use(cors());
app.use(express.json());

require('dotenv').config();

const ObjectID = require('mongodb').ObjectID;


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kniae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log('Hit the db')
});

async function run() {
    try {
        await client.connect();
        const database = client.db("eKart-store");
        const shopCollection = database.collection("products");
        const orderCollection = database.collection('orders');

        // get the order from ui
        app.post('/order', async (req, res)=>{
            const newOrder = req.body;
            console.log(newOrder)
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
        })

        // current order
        app.get('/current-order/:insertId', async(req, res)=>{

            const insertId = req.params.insertId;
            console.log(insertId)
            const query = { _id: ObjectID(insertId) };
            const currentOrder = await orderCollection.findOne(query);
            console.log(currentOrder);
        })


        // user all order
        app.get('/order-list/:emailId', async(req, res)=>{
            const emailId = req.params.emailId;
            const query = { emailAddress: emailId };
            const orders = orderCollection.find(query);
            const result = await orders.toArray();
            res.send(result);
        })
        
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(port)
})