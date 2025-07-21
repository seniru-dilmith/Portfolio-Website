jest.mock("@/util/dbConnect", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/models/ProjectModel", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

import { getProjects, createProject, updateProject, deleteProject } from "@/controllers/projectController";
import dbConnect from "@/util/dbConnect";
import ProjectModel from "@/models/ProjectModel";

describe("projectController", () => {
  it("getProjects calls find", async () => {
    await getProjects();
    expect(dbConnect).toHaveBeenCalled();
    expect(ProjectModel.find).toHaveBeenCalled();
  });

  it("createProject calls create", async () => {
    await createProject({ title: "t" });
    expect(ProjectModel.create).toHaveBeenCalled();
  });

  it("updateProject calls findByIdAndUpdate", async () => {
    await updateProject("1", { title: "x" });
    expect(ProjectModel.findByIdAndUpdate).toHaveBeenCalled();
  });

  it("deleteProject calls findByIdAndDelete", async () => {
    await deleteProject("1");
    expect(ProjectModel.findByIdAndDelete).toHaveBeenCalled();
  });
});
