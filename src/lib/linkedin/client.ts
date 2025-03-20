import axios from "axios";

export async function postToLinkedIn(content: string, imageUrl?: string) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN!;
  const url = "https://api.linkedin.com/v2/ugcPosts";
  await axios.post(
    url,
    {
      author: "urn:li:person:YOUR_LINKEDIN_ID",
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: content,
          shareMediaCategory: imageUrl ? "IMAGE" : "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
}