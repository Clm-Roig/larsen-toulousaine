import { vi } from "vitest";

export const createPrismaModelMock = () => ({
  findMany: vi.fn(),
  findFirst: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
});

export const prismaMock = {
  band: createPrismaModelMock(),
  gig: createPrismaModelMock(),
  place: createPrismaModelMock(),
  organization: createPrismaModelMock(),
  genre: createPrismaModelMock(),
  user: createPrismaModelMock(),
};

export const resetPrismaMock = () => {
  Object.values(prismaMock).forEach((model) => {
    Object.values(model).forEach((mockFn) => {
      mockFn.mockReset();
    });
  });
};
