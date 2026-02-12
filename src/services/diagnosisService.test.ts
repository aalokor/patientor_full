import { describe, it, expect, vi } from "vitest";
import diagnosisService from "./diagnosisService";
import { Diagnosis } from "../types";

describe("diagnosisService.getEntries", () => {
  it("returns all diagnoses using a mock model", async () => {
    const mockDiagnoses: Diagnosis[] = [
      { code: "A1", name: "Flu", latin: "some latin" },
      { code: "A2", name: "Common cold", latin: "more latin" },
    ];

    const fakeModel = {
      find: vi.fn(() => ({
        lean: vi.fn().mockResolvedValue(mockDiagnoses),
      })),
    };

    const result = await diagnosisService.getEntries(fakeModel);

    expect(fakeModel.find).toHaveBeenCalledWith({});
    expect(result).toEqual(mockDiagnoses);
  });
});
