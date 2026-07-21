import { describe, it } from "mocha";
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

const requester = request(app);

describe("Adoption Router", function () {

        it("Debe responder el endpoint", async function () {

        const response = await requester.get("/");

        expect(response.status).to.equal(200);

    });

});