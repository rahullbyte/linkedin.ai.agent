import axios from "axios";

export async function postToLinkedIn(content: string) {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN!;
  const linkedinID = process.env.LINKEDIN_ID!;
  const url = "https://api.linkedin.com/v2/ugcPosts";
  await axios.post(
    url,
    {
      author: `urn:li:person:${linkedinID}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: content,
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
}