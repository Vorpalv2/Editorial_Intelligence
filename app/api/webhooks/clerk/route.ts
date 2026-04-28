// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma as db } from "@/src/prisma"; // Your Neon/Prisma/Drizzle client

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
  console.log(WEBHOOK_SECRET, "in post");

  // 1. Verify headers with Svix (Standard security practice)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Error occured", { status: 400 });
  }

  // 2. Handle the 'user.created' event
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username } = evt.data;
    console.log("Webhook received for user:", id); // Check if you see this
    // 3. Insert into Neon
    const newUser = await db.user.create({
      data: {
        clerkId: id,
        username: username,
        email: email_addresses[0].email_address,
      },
    });
    console.log(newUser, "new user");
  }

  return new Response("", { status: 200 });
}
