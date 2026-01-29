export function validateLocation(form) {
    const name = (form.name ?? "").trim();
    const city = (form.city ?? "").trim();
    const type = (form.type ?? "").trim();
    const label = (form.label ?? "").trim();

    const lengthRaw = String(form.length ?? "").trim();
    const lengthNum = Number(lengthRaw);

    const latNum = Number(form.lat);
    const lngNum = Number(form.lng);

    if (!name) return { ok: false, error: "Please enter a name." };
    if (!city) return { ok: false, error: "Please enter a city." };

    if (form.lat === "" || form.lng === "")
        return { ok: false, error: "Please enter coordinates (lat, lng)." };

    if (Number.isNaN(latNum) || Number.isNaN(lngNum))
        return { ok: false, error: "Coordinates must be valid numbers (lat, lng)." };

    if (latNum < -90 || latNum > 90)
        return { ok: false, error: "Latitude must be between -90 and 90." };

    if (lngNum < -180 || lngNum > 180)
        return { ok: false, error: "Longitude must be between -180 and 180." };

    if (!type) return { ok: false, error: "Please select a type (Boulder / Klettern)." };
    if (!label) return { ok: false, error: "Please enter a label." };

    if (!lengthRaw) return { ok: false, error: "Please enter the length in meters." };
    if (Number.isNaN(lengthNum) || lengthNum <= 0)
        return { ok: false, error: "Length must be a positive number." };

    return { ok: true, error: "" };
}
