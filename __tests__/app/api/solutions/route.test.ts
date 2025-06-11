import { GET } from "@/app/api/solutions/route";
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

describe("/api/solutions - GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  it("returns solutions data successfully", async () => {
    const mockSolutions = [
      { 
        _id: "1", 
        page: "solutions", 
        title: "Web Development", 
        content: "Custom web development solutions"
      },
      { 
        _id: "2", 
        page: "solutions", 
        title: "Mobile Apps", 
        content: "Mobile application development"
      },
    ];

    mockContentModel.find.mockResolvedValue(mockSolutions);

    await GET();

    expect(mockDbConnect).toHaveBeenCalled();
    expect(mockContentModel.find).toHaveBeenCalledWith({ page: "solutions" });
    expect(mockNextResponse).toHaveBeenCalledWith(mockSolutions, { status: 200 });
  });

  it("handles database errors", async () => {
    mockDbConnect.mockRejectedValue(new Error("Database error"));

    await GET();

    expect(mockNextResponse).toHaveBeenCalledWith(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  });

  it("returns empty array when no solutions found", async () => {
    mockContentModel.find.mockResolvedValue([]);

    await GET();

    expect(mockContentModel.find).toHaveBeenCalledWith({ page: "solutions" });
    expect(mockNextResponse).toHaveBeenCalledWith([], { status: 200 });
  });
});
