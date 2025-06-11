import { GET } from "@/app/api/pricing/route";
import dbConnect from "@/util/dbConnect";
import ContentModel from "@/models/ContentModel";
import { NextResponse } from "next/server";

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

describe("/api/pricing - GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined as any);
  });

  it("returns pricing data successfully", async () => {
    const mockPricing = [
      { 
        _id: "1", 
        page: "pricing", 
        title: "Basic Plan", 
        content: "Basic plan description",
        price: "$10/month"
      },
      { 
        _id: "2", 
        page: "pricing", 
        title: "Pro Plan", 
        content: "Pro plan description",
        price: "$25/month"
      },
    ];

    mockContentModel.find.mockResolvedValue(mockPricing);

    await GET();

    expect(mockDbConnect).toHaveBeenCalled();
    expect(mockContentModel.find).toHaveBeenCalledWith({ page: "pricing" });
    expect(mockNextResponse).toHaveBeenCalledWith(mockPricing, { status: 200 });
  });

  it("handles database errors", async () => {
    mockDbConnect.mockRejectedValue(new Error("Database error"));

    await GET();

    expect(mockNextResponse).toHaveBeenCalledWith(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  });

  it("returns empty array when no pricing data found", async () => {
    mockContentModel.find.mockResolvedValue([]);

    await GET();

    expect(mockContentModel.find).toHaveBeenCalledWith({ page: "pricing" });
    expect(mockNextResponse).toHaveBeenCalledWith([], { status: 200 });
  });
});
