// server/repositories/participants.js
import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const collection = () => getDB().collection('participants');

export async function initParticipantsCollection() {
  const col = collection();
  await col.createIndex(
    { email: 1 },
    { unique: true, name: 'uniq_participants_email' }
  );
  console.log('[DB] participants.email unique index ready');
}

export async function createParticipant(data) {
  const result = await collection().insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result.insertedId;
}

export async function listParticipants({ page, limit }) {
  const col = collection();

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    col
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    col.countDocuments()
  ]);

  return { items, total };
}

export async function updateParticipant(id, patch) {
  return collection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } }
  );
}

export function deleteParticipant(id) {
  return collection().deleteOne({ _id: new ObjectId(id) });
}
