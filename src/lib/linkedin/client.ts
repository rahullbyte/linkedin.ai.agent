import axios from "axios";

export async function postToLinkedIn(content: string) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN!;
  const linkedinID = process.env.LINKEDIN_ID!;
  const url = "https://api.linkedin.com/v2/ugcPosts";

  console.log("Posting with author URN:", `urn:li:person:${linkedinID}`);

  try {
    const response = await axios.post(
      url,
      {
        author: `urn:li:person:${linkedinID}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: content,
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );
    console.log("LinkedIn API response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`LinkedIn API error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}