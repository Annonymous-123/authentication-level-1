import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = 3000;
console.log(process.versions);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
const { Pool } = pg;

const pool = new Pool({
  connectionString:
    'postgresql://postgres.icozxkvwpkafsfrrgudh:Yo^2HoneySingh@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.connect();
// postgresql://postgres:[YOUR-PASSWORD]@:5432/postgres

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const emailCheck = await pool.query('SELECT * FROM USERS WHERE EMAIL=$1', [
      email,
    ]);

    if (emailCheck.rows.length > 0) {
      res.send('Email already registered. Please login');
    } else {
      await pool.query('INSERT INTO USERS (email,password) VALUES($1,$2)', [
        email,
        password,
      ]);
      res.render('home.ejs');
    }
  } catch (err) {
    console.log(err);
  }
});

app.post('/login', async (req, res) => {
 const email = req.body.username;
  const password = req.body.password;
  try {
    const emailCheck = await pool.query('SELECT * FROM USERS WHERE EMAIL=$1', [
      email,
    ]);

    if (emailCheck.rows.length > 0) {
     const user=emailCheck.rows[0];
     if(user.password===password){
       res.render('secrets.ejs');
     }
     else{
       res.send('Incorrect Password');
     }
    }
       else {
     res.send("User not found");
    }
  }
   catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
