import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { formatDatabaseError } from '@/lib/utils/error-handler';

export async function POST(req: Request) {
  console.log('🎯 Webhook received at:', new Date().toISOString());
  
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing svix headers:', {
      'svix-id': svix_id ? '✓' : '✗',
      'svix-timestamp': svix_timestamp ? '✓' : '✗',
      'svix-signature': svix_signature ? '✓' : '✗'
    });
    return new Response('Error occurred -- no svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Debug logging
  console.log('🔑 Webhook Secret:', process.env.CLERK_WEBHOOK_SECRET?.slice(0, 5) + '...');
  console.log('📜 Headers:', {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature?.slice(0, 10) + '...'
  });

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ CLERK_WEBHOOK_SECRET is not set');
    return new Response('Configuration error', { status: 500 });
  }

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
    console.log('✅ Webhook verified successfully');
  } catch (err) {
    console.error('❌ Webhook verification failed:', {
      error: err,
      secret: webhookSecret?.slice(0, 5) + '...',
      bodyLength: body.length,
      headers: {
        'svix-id': svix_id?.slice(0, 10),
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature?.slice(0, 10) + '...'
      }
    });
    return new Response('Error occurred', { status: 400 })
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log('📣 Processing event type:', eventType);
  
  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log('⚠️ Unhandled event type:', eventType);
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('❌ Database operation failed:', {
      eventType,
      userId: evt.data.id,
      error: formatDatabaseError(error)
    });
    return new Response('Database operation failed', { status: 500 });
  }
}

async function handleUserCreated(data: any) {
  try {
    const user = await db.user.create({
      data: {
        id: data.id,
        email: data.email_addresses[0]?.email_address,
        username: data.username || `user_${data.id.split('_')[1]}`,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
        banned: data.banned || false,
        createdAt: new Date(data.created_at),
        lastSignInAt: data.last_sign_in_at ? new Date(data.last_sign_in_at) : null,
      },
    });

    // Create login history entry if client info is available
    if (data.event_attributes?.http_request) {
      await db.loginHistory.create({
        data: {
          userId: user.id,
          clientIp: data.event_attributes.http_request.client_ip,
          userAgent: data.event_attributes.http_request.user_agent,
        }
      });
    }

    console.log('✨ User created:', {
      id: user.id,
      email: user.email,
      username: user.username,
      banned: user.banned,
      lastSignIn: user.lastSignInAt
    });

    return user;
  } catch (error) {
    console.error('❌ User creation failed:', error);
    throw error;
  }
}

async function handleUserUpdated(data: any) {
  try {
    const user = await db.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses[0]?.email_address,
        firstName: data.first_name,
        lastName: data.last_name,
        imageUrl: data.image_url,
        username: data.username
      },
    });
    console.log('📝 User updated:', {
      id: user.id,
      email: user.email,
      username: user.username
    });
    return user;
  } catch (error) {
    console.error('❌ User update failed:', error);
    throw error;
  }
}

async function handleUserDeleted(data: any) {
  try {
    const user = await db.user.delete({
      where: { id: data.id },
    });
    console.log('🗑️ User deleted:', {
      id: user.id,
      email: user.email,
    });
    return user;
  } catch (error) {
    console.error('❌ User deletion failed:', error);
    throw error;
  }
}