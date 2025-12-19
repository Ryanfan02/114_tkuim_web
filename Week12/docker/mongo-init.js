
db = db.getSiblingDB('week12');


db.createCollection('participants');
db.participants.createIndex({ ownerId: 1 });


db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });


db.users.insertOne({
  email: 'admin@example.com',
  passwordHash: '$2b$10$kADqEnfFr/juvrlSmXjsM.OvXEA29Ngmi3L3I6fk/vp6RFqSuQ/.', 
  role: 'admin',
  createdAt: new Date()
});
