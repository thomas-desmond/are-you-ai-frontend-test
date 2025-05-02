import { AiImageDescription } from "@/types/aiImageDescription";
import { SimilarityScore } from "@/types/similarityScore";

async function getAiSimilarity(
  sessionId: string,
  text: string,
  aiImageDescription: string,
  imageUrl: string
): Promise<number> {
  try {
    const response = await fetch(
      process.env.API_ENDPOINT + "/getSimilarityScore",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-Identifier": sessionId,
        },
        body: JSON.stringify({ sessionId, text, aiImageDescription, imageUrl }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch similarity score`);
    }

    const data = (await response.json()) as SimilarityScore;

    return data.similarityScore;
  } catch (error) {
    console.error("Error fetching similarity score:", error);
    return 0;
  }
}

async function getAiDescriptionAndInsertToVectorize(
  sessionId: string,
  imageUrl: string
): Promise<string> {
  try {
    const response = await fetch(
      process.env.API_ENDPOINT + "/aiImageDescription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Session-Identifier": sessionId,
        },
        body: JSON.stringify({ sessionId, imageUrl }),
      }
    );

    console.log("ENDPOITN URL", process.env.API_ENDPOINT);
    console.log("RESPONSE status", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch AI image description`);
    }

    const data = (await response.json()) as AiImageDescription;

    return data?.aiImageDescription;
  } catch (error) {
    console.error("Error fetching AI image description:", error);
    return "";
  }
}

async function getRandomAIGeneratedImage(sessionId: string): Promise<string> {
  try {
    const url = process.env.API_ENDPOINT + "/randomImageUrl";
    console.log("Request URL:", url);
    console.log("Request method:", "GET");
    console.log("Request headers:", {
      "Content-Type": "application/json",
      "Session-Identifier": sessionId
    });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Session-Identifier": sessionId,
      },
      cache: 'no-store'
    });

    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    // Try to get the response text even if the status is not ok
    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (!response.ok) {
      throw new Error(`Failed to fetch AI generated image: ${response.status} ${response.statusText}\nResponse body: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log("Parsed response data:", data);

    return data.imageUrl;
  } catch (error) {
    console.error("Error fetching AI generated image:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    return "";
  }
}

export {
  getAiSimilarity,
  getAiDescriptionAndInsertToVectorize,
  getRandomAIGeneratedImage,
};
