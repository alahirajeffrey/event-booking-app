import request from "supertest";
import server from "../src/server";

describe("Server test", () => {
  describe("GET /api/v1/", () => {
    it("should return a 200 response code and message", async () => {
      const response = await request(server).get("/api/v1/").expect(200);
      expect(response.body).toHaveProperty("message", "welcome");
    });
  });
});
