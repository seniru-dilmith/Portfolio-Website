import mongoose from "mongoose";
import dbConnect from "@/util/dbConnect";

jest.mock("mongoose", () => ({
  connect: jest.fn(() => Promise.resolve({ connection: {} })),
}));

describe("dbConnect", () => {
  it("connects using mongoose", async () => {
    const conn = await dbConnect();
    expect(mongoose.connect).toHaveBeenCalled();
    expect(conn).toBeDefined();
  });
});
