console.log("=== EMPEZÓ A CARGAR adoption.router.test.js ===");
import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
console.log("=== IMPORTS OK ===");

const requester = request(app); //cliente para mi app
console.log("=== ANTES DEL DESCRIBE ===");
describe("Adoption Router", function () {
    it("Debe obtener todas las adopciones", async function () {

        const response = await requester.get("/api/adoptions");
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("status");
        expect(response.body.status).to.equal("success");
        expect(response.body).to.have.property("payload");
        expect(response.body.payload).to.be.an("array");
    });

});