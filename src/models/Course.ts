import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/sequelize';
import User from './User';

export interface CourseAttributes {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  price: number;
  createdAt?: Date;
  createdBy?: string | null;
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'createdAt' | 'createdBy'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public instructor!: string;
  public duration!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public createdBy!: string | null;
}

Course.init(
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    instructor: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    createdBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    tableName: 'courses',
    timestamps: true,
    updatedAt: false,
  }
);

export default Course;

