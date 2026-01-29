import { describe, it, expect } from "vitest";
import { validateLocation } from "./locationValidation";

function base(overrides = {}) {
    return {
        name: "Waldkante",
        city: "Berlin",
        lat: 52.52,
        lng: 13.405,
        type: "boulder",
        label: "7A",
        length: 12,
        ...overrides,
    };
}

describe("validateLocation", () => {
    it("fails when name is missing", () => {
        const r = validateLocation(base({ name: "" }));
        expect(r.ok).toBe(false);
        expect(r.error).toBe("Please enter a name.");
    });

    it("fails when coordinates are out of range", () => {
        const r = validateLocation(base({ lat: 200 }));
        expect(r.ok).toBe(false);
        expect(r.error).toBe("Latitude must be between -90 and 90.");
    });

    it("passes for valid input", () => {
        const r = validateLocation(base());
        expect(r.ok).toBe(true);
        expect(r.error).toBe("");
    });
});
