import cohere from "cohere-ai";

const cohereClient = new cohere.CohereClientV2({
  token: process.env.COHERE_API_KEY || "",
});

/**
 * Generate a summary using Cohere's summarization API.
 *
 * @param pdfText - The text extracted from your PDF.
 * @returns A promise that resolves to a summary string.
 */
export const generateSummaryFromCohere = async (
  pdfText: string
): Promise<string> => {
  try {
    const response = await cohereClient.summarize({
      text: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
      length: "medium",
      format: "paragraph",
      model: "summarize-xlarge",
    });

    const summary = response.summary;
    if (!summary) {
      throw new Error("Empty response from Cohere API");
    }
    return summary;
  } catch (error: any) {
    console.error("Cohere API Error:", error);
    throw error;
  }
};
