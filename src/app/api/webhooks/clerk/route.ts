import prisma from '@/lib/client'
import { WebhookEvent } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Extract event data
  const { id } = evt.data;
  const eventType = evt.type;
  
  console.log(`Webhook received: ${eventType} for user ${id}`);
  
  // Parse payload once
  const parsedData = JSON.parse(body).data;

  if (eventType === 'user.created') {
    try {
      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { id: parsedData.id }
      });

      if (existingUser) {
        console.log(`User already exists: ${parsedData.id}`);
        return new Response('Usuário já existe!', {
          status: 200
        });
      }

      await prisma.user.create({
        data: {
          id: parsedData.id,
          username: parsedData.username || `user_${parsedData.id.slice(-6)}`,
          avatar: parsedData.image_url || "/noAvatar.png",
          cover: "/noCover.png",
          name: parsedData.first_name || null,
          surname: parsedData.last_name || null,
        }
      })

      console.log(`User created successfully: ${parsedData.id}`);
      revalidatePath('/profile/[username]');

      return new Response('Usuário criado!', {
        status: 200
      });

    } catch (err) {
      console.error('Error creating user:', err);
      return new Response('Falha ao criar o usuário!', {
        status: 500
      });
    }
  }

  if (eventType === 'user.updated') {
    try {
      // Use upsert para criar ou atualizar
      await prisma.user.upsert({
        where: {
          id: parsedData.id
        },
        update: {
          username: parsedData.username,
          avatar: parsedData.image_url || "/noAvatar.png",
          name: parsedData.first_name || null,
          surname: parsedData.last_name || null,
        },
        create: {
          id: parsedData.id,
          username: parsedData.username || `user_${parsedData.id.slice(-6)}`,
          avatar: parsedData.image_url || "/noAvatar.png",
          cover: "/noCover.png",
          name: parsedData.first_name || null,
          surname: parsedData.last_name || null,
        }
      })

      console.log(`User upserted successfully: ${parsedData.id}`);
      revalidatePath('/profile/[username]');

      return new Response('Usuário atualizado!', {
        status: 200
      });

    } catch (err) {
      console.error('Error updating user:', err);
      return new Response('Falha ao atualizar o usuário!', {
        status: 500
      });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      // Verificar se o usuário existe antes de deletar
      const existingUser = await prisma.user.findUnique({
        where: { id: parsedData.id }
      });

      if (!existingUser) {
        console.log(`User not found for deletion: ${parsedData.id}`);
        return new Response('Usuário não encontrado!', {
          status: 200
        });
      }

      await prisma.user.delete({
        where: {
          id: parsedData.id
        }
      });

      console.log(`User deleted successfully: ${parsedData.id}`);
      revalidatePath('/');

      return new Response('Usuário deletado!', {
        status: 200
      });

    } catch (err) {
      console.error('Error deleting user:', err);
      return new Response('Falha ao deletar o usuário!', {
        status: 500
      });
    }
  }

  return new Response('Webhook verificado', { status: 200 })
}