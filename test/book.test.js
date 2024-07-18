process.env.NODE_ENV = "test"

const require = require("supertest")
const db = require("../db")
const app = require("../app");
const { response } = require("express");


let book_isbn;

describe("/POST book", function(){
    test("creating a book", async()=>{
        let book = await db.query()
    })
})

beforeEach(async ()=>{
    let result = await db.query(
    `INSERT INTO books (
            isbn,
            amazon_url,
            author,
            language,
            pages,
            publisher,
            title,
            year) 
         VALUES ('123432122',
        'https://amazon.com/taco',
        'Elie',
        'English',
        100,
        'Nothing publishers',
        'my first book', 2008) 
         RETURNING isbn`)
    
    return result.rows[0].isbn
})

describe("/ POST", function(){
    test("creating a book", async ()=>{
        const response = await request(app).post("/books").send({
            isbn:`473922301`,
            amazon_url: `amazon.com/fish`,
            author:`God`,
            language:`English`,
            pages:`10`,
            publisher:`America Inc`,
            title:`Where is the fish`,
            year:`1479`
        })
           expect(response.statuscode).toBe(201)
            expect(response.body.book).toHaveProperty(`isbn`)
    })

    test("preventing book from getting created without isbn#", async()=>{
        const response = await request(app).post("/books").send({
            isbn:``,
            amazon_url: `amazon.com/fish`,
            author:`God`,
            language:`English`,
            pages:10,
            publisher:`America Inc`,
            title:`Where is the fish`,
            year:1349
        })
        expect(response.statuscode).toBe(400)
        expect(response.body.book).toHaveProperty(`isbn`)
    })

})

describe("/ Get", ()=>{
    test("get a list of book", async()=>{
        const response = await request(app).get("/books")
        const books = request.body.books
    })
    expect(response.statuscode).toBe(200)
    epect(books[0]).toHaveProperty(`isbn`)
    epect(books[0]).toHaveProperty(`year`)    
    epect(books[0]).toHaveProperty(`author`)    
    
})

describe("/ Get", ()=>{
    test("get a single book", async()=>{
        const response = await request(app).get("/books/:id")
        const books = request.body.books
    })
    expect(response.statusCode).toBe(200)
    expect(books).toHaveProperty(`isbn`) 
    
})

describe("/ Update", ()=>{
    test("update single book", async()=>{
        const response = await request(app).update("/books/:isbn").send({
            pages:`20`
        })
        expect(response.statuscode).toBe(200)
        expect(response.body.pages).toBe(`20`)
    })
})

describe("/ Delete", ()=>{
    test("deleteing a single book", async()=>{
        const response = await request(app).delete("/books/:isbn")
    })
    expect(response.body).toEqual({message: `book deleted!`})
})



afterEach(async()=>{
    let result = await db.query(
        `DELETE FROM books`)

    return result.rows
})

afterAll(async function () {
    await db.end()
  });