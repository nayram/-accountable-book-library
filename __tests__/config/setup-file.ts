import mongoose from 'mongoose';
beforeAll(async () => {
  if (process.env['MONGO_URI']) {
    await mongoose.connect(process.env['MONGO_URI']);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
