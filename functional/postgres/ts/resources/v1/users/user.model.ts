import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../../../config/v1/postgres'; // Adjust path as needed

// Enum types
export enum UserStatus {
  INACTIVE = '0',
  ACTIVE = '1',
  BLOCKED = '2',
  DELETED = '3',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// Model attributes interface
export interface UserAttributes {
  id: number;
  first_name: string;
  last_name?: string | null;
  email: string;
  password: string;
  phone_code?: string | null;
  phone_number?: string | null;
  profile_picture?: string | null;
  auth_token?: string | null;
  fcm_token?: string | null;
  email_verification_otp?: number | null;
  status: UserStatus;
  role: UserRole;
  is_email_verified: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

// Optional attributes for `create`
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'last_name' | 'phone_code' | 'phone_number' | 'profile_picture' | 'auth_token' | 'fcm_token' | 'email_verification_otp' | 'deleted_at'> {}

// Sequelize model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public first_name!: string;
  public last_name!: string | null;
  public email!: string;
  public password!: string;
  public phone_code!: string | null;
  public phone_number!: string | null;
  public profile_picture!: string | null;
  public auth_token!: string | null;
  public fcm_token!: string | null;
  public email_verification_otp!: number | null;
  public status!: UserStatus;
  public role!: UserRole;
  public is_email_verified!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at!: Date | null;

  // timestamps etc.
  // static associate(models: any) {
  //   User.hasMany(models.Address, {
  //     foreignKey: 'user_id',
  //     onDelete: 'CASCADE',
  //   });
  // }
}

// Init the model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    auth_token: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    fcm_token: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    email_verification_otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      defaultValue: UserStatus.ACTIVE,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.USER,
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // optional: uses `deleted_at` for soft deletes
  }
);

export default User;
