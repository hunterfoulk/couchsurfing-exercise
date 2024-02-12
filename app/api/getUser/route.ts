import { getUserById } from '@/lib/queries';

export async function GET() {
  const users = await getUserById(1);

  return Response.json({ users });
}
