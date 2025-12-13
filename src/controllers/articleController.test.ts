jest.mock("@/util/dbConnect", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/models/ArticleModel", () => ({
  __esModule: true,
  default: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

import { getArticles, getArticleById, getArticleBySlug, getArticleByIdOrSlug, createArticle, updateArticle, deleteArticle } from "@/controllers/articleController";
import dbConnect from "@/util/dbConnect";
import ArticleModel from "@/models/ArticleModel";

describe("articleController", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("getArticles calls find", async () => {
        await getArticles();
        expect(dbConnect).toHaveBeenCalled();
        expect(ArticleModel.find).toHaveBeenCalled();
        expect(ArticleModel.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
    });

    it("getArticleById calls findById", async () => {
        await getArticleById("test-id");
        expect(ArticleModel.findById).toHaveBeenCalledWith("test-id");
    });

    it("getArticleBySlug calls findOne", async () => {
        await getArticleBySlug("test-slug");
        expect(ArticleModel.findOne).toHaveBeenCalledWith({ slug: "test-slug" });
    });

    describe("getArticleByIdOrSlug", () => {
        it("calls findById if valid ObjectId", async () => {
             const validId = "507f1f77bcf86cd799439011";
            (ArticleModel.findById as jest.Mock).mockResolvedValue({ title: "Found" });
            await getArticleByIdOrSlug(validId);
            expect(ArticleModel.findById).toHaveBeenCalledWith(validId);
        });

        it("calls findOne if valid ObjectId is not found (fallback to slug check logic inside?)", async () => {
             // Current logic: if ID format, check findById. If logic returns null, currently it DOES NOT fall back to slug in the function.
             // Let's re-read controller: 
             // if (isObjectId) { const article = ...; if (article) return article; }
             // return ArticleModel.findOne({ slug: idOrSlug });
             
            const validId = "507f1f77bcf86cd799439011";
            (ArticleModel.findById as jest.Mock).mockResolvedValue(null);
            await getArticleByIdOrSlug(validId);
            expect(ArticleModel.findById).toHaveBeenCalledWith(validId);
            expect(ArticleModel.findOne).toHaveBeenCalledWith({ slug: validId });
        });

        it("calls findOne if not a valid ObjectId", async () => {
            const slug = "test-slug";
            await getArticleByIdOrSlug(slug);
            expect(ArticleModel.findById).not.toHaveBeenCalled();
            expect(ArticleModel.findOne).toHaveBeenCalledWith({ slug });
        });
    });

    describe("createArticle", () => {
        it("calls create with generated slug if not provided", async () => {
            const data = { title: "Test Title", author: "Test", createdAt: new Date() };
            (ArticleModel.findOne as jest.Mock).mockResolvedValue(null); // No collision

            await createArticle(data);

            expect(ArticleModel.create).toHaveBeenCalledWith(expect.objectContaining({
                title: "Test Title",
                slug: "test-title"
            }));
        });

        it("handles slug collision by appending counter", async () => {
            const data = { title: "Test Title", author: "Test", createdAt: new Date() };
            
            // First check returns existing doc (collision), second check returns null (free)
            (ArticleModel.findOne as jest.Mock)
                .mockResolvedValueOnce({ _id: "existing" })
                .mockResolvedValueOnce(null);

            await createArticle(data);

            expect(ArticleModel.findOne).toHaveBeenCalledTimes(2);
            expect(ArticleModel.create).toHaveBeenCalledWith(expect.objectContaining({
                title: "Test Title",
                slug: "test-title-1"
            }));
        });

        it("throws error if provided slug already exists", async () => {
             const data = { title: "Test", slug: "existing-slug" };
             (ArticleModel.findOne as jest.Mock).mockResolvedValue({ _id: "existing" });

             await expect(createArticle(data)).rejects.toThrow("Slug already exists");
        });
    });

    describe("updateArticle", () => {
        it("calls findByIdAndUpdate", async () => {
             (ArticleModel.findOne as jest.Mock).mockResolvedValue(null);
            await updateArticle("1", { title: "x" });
            expect(ArticleModel.findByIdAndUpdate).toHaveBeenCalled();
        });

        it("checks for collision if slug updates", async () => {
            (ArticleModel.findOne as jest.Mock).mockResolvedValue({ _id: "other-id" });
            await expect(updateArticle("my-id", { slug: "taken-slug" }))
                .rejects.toThrow("Slug already exists");
            
            expect(ArticleModel.findOne).toHaveBeenCalledWith({ slug: "taken-slug", _id: { $ne: "my-id" } });
        });
    });

    it("deleteArticle calls findByIdAndDelete", async () => {
        await deleteArticle("1");
        expect(ArticleModel.findByIdAndDelete).toHaveBeenCalled();
    });
});
