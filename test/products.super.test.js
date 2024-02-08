import supertest from "supertest";
import { describe } from "mocha";
import {expect} from "chai";
import jwt from "jsonwebtoken"
const requester = supertest ('http://localhost:8080')
const pid="65b28d7600cb16e23a06ebe7"
const mockProduct={
        "title": "Prueba test",
        "description": "prueba1",
        "price": 1500,
        "thumbnail": "uuulrl",
        "code": "5",
        "stock": 50550,
        "category":"limpieza"
}
const mockUser= {
    email:"adminCoder@coder.com",
    password:'adminCod3r123'
}
let cookie;
let tokenDecoded;
describe("products endpoints",()=>{
    

    before(async function () {
        this.timeout(500000)
        const response = await requester.post('/api/sessions/login').send(mockUser)

        const cookieResult = response.headers['set-cookie'][0]
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1].split(';')[0]
        }
        console.log(cookie)
        const token=cookie.value
        tokenDecoded=jwt.decode(token)
    })


    describe("GET /api/products/", ()=>{
        it("should get all products",async function (){
            this.timeout(50000)
            const response = await requester.get(`/api/products`)
            expect(response.status).to.equal(200);
        })
    })
    describe("GET /api/products/:pid",()=>{
        it("should get product by id",async function(){
            this.timeout(50000)
            try {
                const response = await requester.get(`/api/products/${pid}`);

                console.log('Response Status:', response.status);
                console.log('Response Body:', response.body.prod._id);

                expect(response.status).to.equal(200);
                expect(response.body.prod._id).to.deep.equal(pid);
            } catch (error) {

                console.error('Error during test:', error.message);
                throw error; 
            }
        })
    })
    describe ("POST /api/product/",()=>{
        it("should create product",async function(){
            this.timeout(50000)
            try {
                
                const response = await requester.post("/api/products/").send(mockProduct).set(tokenDecoded)
                console.log("response status POST",response.status)
                console.log("role",response)
                expect(response.body.owner.role).to.be.equal("ADMIN" || "PREMIUM")
                expect(response.status).to.be.equal(200)
            } catch (error) {
                console.error(error.message)
            }
        })
    })
    describe("DELETE /api/product/:pid",()=>{
        it("should delete product by id",async function(){
            this.timeout(50000)

                const response=await requester.delete(`/api/products/${pid}`)
                expect(response.status).to.be.equal(200)
                console.log("response status DELETE",response.status)

        })
    })
    describe("PUT /api/product/:pid",()=>{
        it('should update product by id',async function(){
            this.timeout(50000)
                const updatedProduct={
                    title:"pruebaUpdate"
                }
                const response=await requester.put(`/api/products/${pid}`).send()
                expect(response.status).to.be.equal(200)
    
        })
    })
})