import mongoose from "mongoose";

jest.mock("mongoose", () => ({
  connect: jest.fn(() => Promise.resolve({ connection: {} })),
}));

describe("dbConnect", () => {
  beforeAll(() => {
    process.env.NEXT_MONGO_URI = "mongodb://localhost/test";
  });

  it("connects using mongoose", async () => {
    const { default: dbConnect } = await import("@/util/dbConnect");
    const conn = await dbConnect();
    expect(mongoose.connect).toHaveBeenCalled();
    expect(conn).toBeDefined();
  });
});
