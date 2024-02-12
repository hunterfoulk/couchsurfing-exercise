export interface User {
  id: number;
  name: string;
  relationships: Relationship[];
}

export interface Relationship {
  type: 'friend' | 'family';
  userId: number;
}

export interface RelationshipDistanceResult {
  relationshipDistance: number;
}
