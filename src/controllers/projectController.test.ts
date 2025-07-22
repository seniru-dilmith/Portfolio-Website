jest.mock("@/util/dbConnect", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/models/ProjectModel", () => ({
  __esModule: true,
  default: {
    find: jest.fn(() => ({ sort: jest.fn() })),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

import { getProjects, createProject, updateProject, deleteProject } from "./projectController";
import dbConnect from "@/util/dbConnect";
import ProjectModel from "@/models/ProjectModel";

describe("projectController", () => {
  it("getProjects calls find and sort", async () => {
    const sortMock = jest.fn();
    (ProjectModel.find as jest.Mock).mockReturnValue({ sort: sortMock });
    await getProjects();
    expect(dbConnect).toHaveBeenCalled();
    expect(ProjectModel.find).toHaveBeenCalled();
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it("createProject calls create", async () => {
    const data = { title: "t" };
    await createProject(data);
    expect(dbConnect).toHaveBeenCalled();
    expect(ProjectModel.create).toHaveBeenCalledWith(data);
  });

  it("updateProject calls findByIdAndUpdate", async () => {
    await updateProject("1", { title: "x" });
    expect(dbConnect).toHaveBeenCalled();
    expect(ProjectModel.findByIdAndUpdate).toHaveBeenCalledWith("1", { title: "x" }, { new: true, runValidators: true });
  });

  it("deleteProject calls findByIdAndDelete", async () => {
    await deleteProject("1");
    expect(dbConnect).toHaveBeenCalled();
    expect(ProjectModel.findByIdAndDelete).toHaveBeenCalledWith("1");
  });
});
