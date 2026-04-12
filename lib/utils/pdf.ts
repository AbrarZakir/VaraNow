/** Client-side helper: fetches the generated PDF for a property from the API. */
export async function generatePropertyPdf(propertyId: string): Promise<Blob | null> {
  try {
    const res = await fetch(`/api/properties/${propertyId}/pdf`);
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}
