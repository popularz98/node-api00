const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: '157.245.59.56',
  user: 'u6401510',
  password: '6401510',
  database: 'u6401510_accessories',
  port: 3366
})

var app = express()
app.use(cors())
app.use(express.json())

app.get('/', function(req, res) {
  res.json({
    "status": "ok",
    "message": "Hello World"
  })
})

app.get('/customers', function(req, res) {
  connection.query(
    'SELECT * FROM a1_customer',
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})

app.get('/order', function(req, res) {
  connection.query(
    'SELECT * FROM a1_order',
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})

app.get('/products', function(req, res) {
  connection.query(
    'SELECT * FROM a1_product',
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})

// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get("/top_customer", function (req, res) {
  connection.query(
    `SELECT 
    C.name, 
    SUM(O.qtt*P.price) AS price_sum 
  FROM a1_customer AS C 
    INNER JOIN a1_order AS O ON C.Cid = O.Cid 
    INNER JOIN a1_product AS P ON O.Pid = P.Pid 
  GROUP BY 
    C.Cid
  ORDER BY 
    price_sum DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});

// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get('/top_products', function(req, res){
  connection.query(
    `SELECT O.Oid, P.Pname, O.qtt, SUM(O.qtt) as Total_QTY FROM a1_order as O INNER JOIN a1_product as P ON O.Pid = P.Pid GROUP BY O.Oid, P.Pname, O.qtt, P.price ORDER BY Total_QTY DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});


app.post("/createusers", function (req, res) {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const city = req.body.city;
  const tel = req.body.tel;
  connection.query(
    `INSERT INTO a1_customer (name, surname, email, city,  tel) VALUES (?, ?, ?, ?, ? ,? ,?)`,
    [name, surname, email, city, tel],
    function (err, results) {
      if (err) {
        res.json(err);
      }
      res.json(results);
    }
  );
});


app.post('/orders', function(req, res) {
  const values = req.body
  console.log(values)
  connection.query(
    'INSERT INTO a1_order (id,Oid, Pid, qtt, Cid) VALUES ?', [values],
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})


app.listen(5000, () => {
  console.log('Server is started.')
})