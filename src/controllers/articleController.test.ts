jest.mock("@/util/dbConnect", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/models/ArticleModel", () => ({
  __esModule: true,
  default: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

import { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } from "@/controllers/articleController";
import dbConnect from "@/util/dbConnect";
import ArticleModel from "@/models/ArticleModel";

describe("articleController", () => {  it("getArticles calls find", async () => {
    await getArticles();
    expect(dbConnect).toHaveBeenCalled();
    expect(ArticleModel.find).toHaveBeenCalled();
    expect(ArticleModel.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it("getArticleById calls findById", async () => {
    await getArticleById("test-id");
    expect(dbConnect).toHaveBeenCalled();
    expect(ArticleModel.findById).toHaveBeenCalledWith("test-id");
  });

  it("createArticle calls create", async () => {
    const data = { title: "t", author: "Test", createdAt: new Date() };
    await createArticle(data);
    expect(ArticleModel.create).toHaveBeenCalledWith(data);
  });

  it("updateArticle calls findByIdAndUpdate", async () => {
    await updateArticle("1", { title: "x" });
    expect(ArticleModel.findByIdAndUpdate).toHaveBeenCalled();
  });

  it("deleteArticle calls findByIdAndDelete", async () => {
    await deleteArticle("1");
    expect(ArticleModel.findByIdAndDelete).toHaveBeenCalled();
  });
});
