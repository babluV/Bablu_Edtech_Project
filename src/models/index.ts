import sequelize from '@/lib/sequelize';
import User from './User';
import Course from './Course';

// Define associations after both models are imported
Course.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Course, { foreignKey: 'createdBy', as: 'courses' });

// Initialize all models
const models = {
  User,
  Course,
  sequelize,
};

export default models;

