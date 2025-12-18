import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/sequelize';

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'instructor' | 'student';
  createdAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public name!: string;
  public password!: string;
  public role!: 'admin' | 'instructor' | 'student';
  public readonly createdAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'student',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    updatedAt: false,
  }
);

export default User;

