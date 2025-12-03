import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

app.get('/searchByKeyword', async (req, res)=>{
    let keyword = req.query.keyword;
    let sql = `SELECT authorId, firstName, lastName, quote
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes": rows});
});

app.get('/searchByAuthor', async (req,res)=>{
    let userAuthorId = req.query.authorId;
    let sql = `SELECT authorId, firstName, lastName, quote
                FROM q_quotes
                NATURAL JOIN q_authors
                WHERE authorId = ?`;
    let sqlParams = [userAuthorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {"quotes": rows});
});

//setting up database connection pool
const pool = mysql.createPool({
    host: "axxb6a0z2kydkco3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "t4lcsckwrx5sqb5n",
    password: "atlbm814mvapu1bj",
    database: "iiw2psj45525cezu",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
    let sql = `SELECT authorId, firstName, lastName
               FROM q_authors
               ORDER BY lastName`;

    let catSql = `SELECT DISTINCT category
                    FROM q_quotes
                    WHERE category IS NOT NULL
                    ORDER BY category`;

    const [rows] = await pool.query(sql);
    const [categories] = await pool.query(catSql);

   res.render("index", {"authors": rows, categories: categories});
});

app.get('/api/author/:id', async (req, res) => {
    let authorId = req.params.id;
    let sql = `SELECT *
               FROM q_authors
               WHERE authorId = ?`;
    const [rows] = await pool.query(sql, [authorId]);
    res.send(rows);
});

app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT category
            FROM q_quotes
            WHERE category IS NOT NULL
            ORDER BY category
        `);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});


app.get("/searchByCategory", async(req, res) => {
    let category = req.query.category;
    let sql = `SELECT quote, firstName, lastName, q_quotes.authorId
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE category = ?`;
    const [rows] = await pool.query(sql, [category]);
    res.render("results", {"quotes": rows});
});

app.get("/searchByLikes", async (req, res) => {
    let minLikes = parseInt(req.query.minLikes) || 0;
    let maxLikes = parseInt(req.query.maxLikes) || 1000;

    let sql = `SELECT quote, firstName, lastName, q_quotes.authorId
               FROM q_quotes
               NATURAL JOIN q_authors
               WHERE likes BETWEEN ? AND ?`;

    const [rows] = await pool.query(sql, [minLikes, maxLikes]);

    res.render("results", { "quotes": rows });
});


app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})