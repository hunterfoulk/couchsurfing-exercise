import { getUserById } from '@/lib/queries';

export async function GET() {
  const user = await getUserById(1);

  return Response.json({ user });
}
