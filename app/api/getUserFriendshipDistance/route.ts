import { findUsersRelationshipDistance } from '@/lib/queries';

export async function GET() {
  const currentUser = 1;
  const targetUser = 3;
  const distance = await findUsersRelationshipDistance(currentUser, targetUser);

  console.log('distance data:', distance);
  return Response.json({ distance });
}
