import mongoose from "mongoose";

jest.mock("mongoose", () => ({
  connect: jest.fn(() => Promise.resolve({ connection: {} })),
}));

describe("dbConnect", () => {
  beforeAll(() => {
    // Set the environment variable for testing
    process.env.NEXT_MONGO_URI = "mongodb://localhost:27017/test";
  });

  afterAll(() => {
    // Clean up the environment variable after tests
    delete process.env.NEXT_MONGO_URI;
  });

  it("connects using mongoose", async () => {
    const { default: dbConnect } = await import("@/util/dbConnect");
    const conn = await dbConnect();
    expect(mongoose.connect).toHaveBeenCalled();
    expect(conn).toBeDefined();
  });
});
