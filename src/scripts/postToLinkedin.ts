import { postToLinkedIn } from "../lib/linkedin/client";

async function run() {
 
  await postToLinkedIn();
}

run().catch(console.error);