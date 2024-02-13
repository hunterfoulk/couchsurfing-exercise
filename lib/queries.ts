import { db } from '@/lib/db';
import { User } from '@prisma/client';

// Get user by user Id
export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error: any) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error: any) {
    throw new Error(`Error fetching all users: ${error.message}`);
  }
};

// Update user's birthday by the user ID
export const updateUserBirthdayById = async (
  userId: number,
  newBirthday: Date
): Promise<User | null> => {
  try {
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        birthday: newBirthday,
      },
    });

    return updatedUser;
  } catch (error: any) {
    throw new Error(`Error updating user birthday: ${error.message}`);
  }
};

export const findUsersRelationshipDistance = async (
  userId1: number,
  userId2: number,
  depth: number = 3
): Promise<number | null> => {
  try {
    // Check if currentUser and targetUser are directly related by family
    const directRelationship = await db.relationship.findFirst({
      where: {
        userId: userId1,
        relatedUserId: userId2,
        relationshipType: 'family',
      },
    });

    if (directRelationship) {
      return -1; // Target user and current user are related as family, return -1
    }

    // Function to find distance through friendships
    const findFriendshipDistanceHelper = async (
      currentUserId: number | null,
      targetUserId: number,
      currentDepth: number
    ): Promise<number | null> => {
      // Check if users are direct friends
      const directFriendship = await db.relationship.findFirst({
        where: { userId: currentUserId, relatedUserId: targetUserId },
      });

      if (directFriendship) {
        return currentDepth; // the current user and target user are direct friends, should return 0
      }

      if (currentDepth >= depth) {
        return null; // Stop search if maximum depth is reached
      }

      // current user's friends
      const currentUserFriends = await db.relationship.findMany({
        where: { userId: currentUserId },
      });

      for (const friend of currentUserFriends) {
        const friendUserId = friend.relatedUserId;
        // Recursively search for the target user in the friends of the current friend
        const distance = await findFriendshipDistanceHelper(
          friendUserId,
          targetUserId,
          currentDepth + 1
        );
        if (distance !== null) {
          return distance;
        }
      }

      return null; // Target user not found in any current friendships
    };

    const distance = await findFriendshipDistanceHelper(userId1, userId2, 0);

    if (distance !== null) {
      return distance;
    }

    throw new Error('Target user not found in current friendships');
  } catch (error: any) {
    throw new Error(`Error finding relationship distance: ${error.message}`);
  }
};
