import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        console.log("Webhook endpoint hit");

        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        // console.log("CLERK_WEBHOOK_SECRET starts with:", webhookSecret.slice(0, 6));
        if (!webhookSecret) {
            console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }

        // Check headers
        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        console.log("Received headers:", {
            "svix-id": svix_id,
            "svix-signature": svix_signature,
            "svix-timestamp": svix_timestamp,
        });

        if (!svix_id || !svix_signature || !svix_timestamp) {
            console.error("Missing one or more Svix headers");
            return new Response("Error occurred -- no svix headers", { status: 400 });
        }

        const body = await request.text();
        const payload = JSON.parse(body);
        console.log("Payload received:", payload);

        const wh = new Webhook(webhookSecret);
        let evt: any;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp,
            })as any;
            console.log("Webhook verified successfully:", evt);
        } catch (err) {
            console.error("Error verifying webhook:", err);
            return new Response("Error occurred", { status: 400 });
        }

        const eventType = evt.type;
        console.log("Event type:", eventType);

        if (eventType === "user.created") {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;
            const email = email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            console.log("Creating user with:", {
                id,
                email,
                name,
                image_url,
            });

            try {
                await ctx.runMutation(api.users.createUser, {
                    email,
                    fullname: name,
                    image: image_url,
                    clerkId: id,
                    username: email.split("@")[0],
                });
                console.log("User created successfully");
            } catch (error) {
                console.error("Error creating user:", error);
                return new Response("Error Creating User", { status: 500 });
            }
        }

        return new Response("Webhook processed successfully", { status: 200 });
    }),
});

export default http;
