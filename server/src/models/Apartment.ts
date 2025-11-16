import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ApartmentAttributes {
  id: number;
  project: string;
  unit_name: string;
  unit_number: string;
  price: number;
  area: number;
  city: string;
  description?: string;
  status: 'available' | 'sold' | 'reserved';
  created_at?: Date;
  updated_at?: Date;
}

interface ApartmentCreationAttributes extends Optional<ApartmentAttributes, 'id' | 'description' | 'status' | 'created_at' | 'updated_at'> {}

class Apartment extends Model<ApartmentAttributes, ApartmentCreationAttributes> implements ApartmentAttributes {
  public id!: number;
  public project!: string;
  public unit_name!: string;
  public unit_number!: string;
  public price!: number;
  public area!: number;
  public city!: string;
  public description?: string;
  public status!: 'available' | 'sold' | 'reserved';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Apartment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    project: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Project cannot be empty',
        },
      },
    },
    unit_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Unit name cannot be empty',
        },
      },
    },
    unit_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Unit number cannot be empty',
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: {
          args: [0.01],
          msg: 'Price must be greater than 0',
        },
      },
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: {
          args: [0.01],
          msg: 'Area must be greater than 0',
        },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'City cannot be empty',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available',
      validate: {
        isIn: {
          args: [['available', 'sold', 'reserved']],
          msg: 'Status must be one of: available, sold, reserved',
        },
        notEmpty: {
          msg: 'Status cannot be empty',
        },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'apartments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['project', 'unit_number'],
        name: 'unique_project_unit_number',
      },
    ],
  }
);

export default Apartment;
