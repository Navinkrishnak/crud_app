const path = require('path');
const express = require('express'); 
const ejs = require('ejs'); 
const bodyParser = require('body-parser'); 
const mysql = require('mysql'); 
const app = express();


const connection = mysql.createConnection({
    host:'192.168.135.28',
    user:'testuser',
    password:'123Admin$',
    database:'testdb',
    port: 4028
});

connection.connect(function(error){
    if(error) console.log(error); else console.log('Database Connected!');
});

//set views file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/',(req,res) => {
        // res.send('CRUD operations using nodeJS / ExpressJS / MySql');

   try{ let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows)=>{
        // if(err) throw err;

        // console.log(rows);
        res.render('user_index',{
            title:'CRUD operations using nodeJS / ExpressJS / MySql ',
            users: rows
        });
    });}catch(err){
        console.log(err);
    }
});

app.get('/add',(req,res) => {
    res.render('user_add',{
        title:'CRUD operations using nodeJS / ExpressJS / MySql '
    });
});

app.post('/save',(req,res) =>{
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data,(err, results) =>{
        if(err) throw err;
        res.redirect('/');
    });
});


app.get('/edit/:userId', (req,res)=>{
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = connection.query(sql,(err, result)=>{
        if(err) throw err;
        res.render('user_edit', {
            title : "CRUD operation using Node js",
            user : result[0]
        });
    });
});


app.post('/update',(req,res) =>{
    const userId = req.body.id;

    let sql = "update users SET name= \'"+req.body.name+"\', email=\'"+req.body.email+"\', phone_no=\'"+req.body.phone_no+"\' where id =\'"+userId+"\'";
    let query = connection.query(sql,(err, results) =>{
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:userId', (req,res)=>{
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = connection.query(sql,(err, result)=>{
        if(err) throw err;
        res.redirect('/');

    });
});


//SERVER LISTENING
app.listen(3000, () =>{
    console.log('Server is running at port 3000');
    console.log('http://localhost:3000/');
});