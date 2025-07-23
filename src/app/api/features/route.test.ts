import { GET } from "@/app/api/features/route";
import dbConnect from "@/util/dbConnect";
import ContentModel from "@/models/ContentModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

jest.mock("@/util/dbConnect", () => jest.fn());
jest.mock("@/models/ContentModel", () => ({
  find: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockContentModel = ContentModel as jest.Mocked<typeof ContentModel>;
const mockNextResponse = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore?.();
});

describe("/api/features - GET", () => {  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue({} as mongoose.Connection);
  });

  it("returns features successfully", async () => {
    const mockFeatures = [
      { 
        _id: "1", 
        page: "features", 
        title: "Feature 1", 
        content: "Feature 1 description" 
      },
      { 
        _id: "2", 
        page: "features", 
        title: "Feature 2", 
        content: "Feature 2 description" 
      },
    ];

    mockContentModel.find.mockResolvedValue(mockFeatures);

    await GET();

    expect(mockDbConnect).toHaveBeenCalled();
    expect(mockContentModel.find).toHaveBeenCalledWith({ page: "features" });
    expect(mockNextResponse).toHaveBeenCalledWith(mockFeatures, { status: 200 });
  });

  it("handles database connection errors", async () => {
    mockDbConnect.mockRejectedValue(new Error("Database connection failed"));

    await GET();

    expect(mockNextResponse).toHaveBeenCalledWith(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  });

  it("handles ContentModel query errors", async () => {
    mockContentModel.find.mockRejectedValue(new Error("Query failed"));

    await GET();

    expect(mockNextResponse).toHaveBeenCalledWith(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  });

  it("returns empty array when no features found", async () => {
    mockContentModel.find.mockResolvedValue([]);

    await GET();

    expect(mockContentModel.find).toHaveBeenCalledWith({ page: "features" });
    expect(mockNextResponse).toHaveBeenCalledWith([], { status: 200 });
  });
});
