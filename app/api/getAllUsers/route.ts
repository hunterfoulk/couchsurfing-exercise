import { getAllUsers } from '@/lib/queries';

export async function GET() {
  const users = await getAllUsers();

  return Response.json({ users });
}
