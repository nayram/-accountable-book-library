import mongoose from 'mongoose'

export const isConnected = () => mongoose.connection.readyState === 1
