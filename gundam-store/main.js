var express = require('express');
var app = express()

app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

var url = 'mongodb://127.0.0.1:27017';
var MongoClient = require('mongodb').MongoClient;

app.post('/edit',async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL = req.body.picURL
    const id = req.body.id

    let client = await MongoClient.connect(url)
    let dbo = client.db("GundamStore")
    var ObjectId = require('mongodb').ObjectId
    const condition = {"_id" : new ObjectId(id)};
    const newValues = {$set : {name:name,price:price,picURL:picURL}}
    await dbo.collection("products").updateOne(condition,newValues)
    res.redirect('/')
})

app.get('/edit/:id', async(req,res)=>{
    const id = req.params.id
    let client = await MongoClient.connect(url)
    let dbo = client.db("GundamStore")
    var ObjectId = require('mongodb').ObjectId
    let condition = {"_id" : new ObjectId(id)};
    const prod = await dbo.collection("products").findOne(condition)
    res.render('edit',{prod:prod})
})

app.post('/add',async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picURL = req.body.picURL
    //kiem tra input
    if(name.length <=5){
        res.render('add',{name_err: 'Min length is 5 characters'})
        return
    }
    //
    const newProduct = {
        'name': name,
        'price':price,
        'picURL':picURL
    }
    let client = await MongoClient.connect(url)
    let dbo = client.db("GundamStore")
    await dbo.collection("products").insertOne(newProduct)
    res.redirect("/")

})

app.get('/add',(req,res)=>{
    res.render('add')
})
app.get('/delete/:id',async (req,res)=>{
    const id = req.params.id
    let client = await MongoClient.connect(url)
    let dbo = client.db("GundamStore")
    var ObjectId = require('mongodb').ObjectId
    let condition = {"_id" : new ObjectId(id)};
    await dbo.collection("products").deleteOne(condition)
    res.redirect("/")
})

app.get('/',async (req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("GundamStore")
    let products = await dbo.collection("products").find().toArray()
    res.render('index',{'products':products})
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log("Server is up!")
})
