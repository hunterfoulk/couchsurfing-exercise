import { updateUserBirthdayById } from '@/lib/queries';

export async function POST() {
  const userId = 1;
  const newBirthday = new Date(); //todays date
  const updatedUser = await updateUserBirthdayById(userId, newBirthday);

  return Response.json({ updatedUser });
}
