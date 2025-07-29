import { Op, where } from 'sequelize';
import * as dataHelper from '../../../helpers/v1/data.helpers';
import User, { UserAttributes } from './user.model';

const IN_ACTIVE = '0';
const ACTIVE = '1';
const BLOCKED = '2';
const DELETED = '3';

export const statuses = Object.freeze({
    IN_ACTIVE,
    ACTIVE,
    BLOCKED,
    DELETED
} as const);

const USER = 'user';
const ADMIN = 'admin';

export const roles = Object.freeze({
    USER,
    ADMIN
} as const);

// interface UserAttributes {
//     id?: number;
//     first_name?: string|null;
//     last_name?: string|null;
//     email: string;
//     password?: string;
//     role?: string;
//     status?: string;
//     phone_number?: string;
//     phone_code?: string;
//     is_email_verified?: boolean;
//     created_at?: Date;
//     updated_at?: Date;
//     deleted_at?: Date | null;
//     auth_token?: string;
//     fcm_token?: string;
//     [key: string]: any;
// }

export const createOne = async (data: UserAttributes): Promise<User | boolean> => {
  console.log('UsersResources@createOne');
  try {
    if (!data) throw new Error('Data is required');
    const user = await User.create(data);
    return user || false;
  } catch (error) {
    console.error("Error UsersResources@createOne:", error);
    return false;
  }
};
export const getOneByColumnNameAndValue = async (columnName: string, columnValue: any): Promise<UserAttributes | null> => {
    console.log('UsersResources@getOneByColumnNameAndValue');
    try {
        const result = await User.findOne({
            where: { [columnName]: columnValue, deleted_at: null },
            raw: true
        });
        return result || null;
    } catch (error) {
        console.error("Error UsersResources@getOneByColumnNameAndValue:", error);
        return null;
    }
};

export const getOneByPhoneCodeAndNumber = async (phoneCode: string, phoneNumber: string): Promise<UserAttributes | boolean> => {
    console.log('UsersResources@getOneByPhoneCodeAndNumber');
    try {
        const result = await User.findOne({
            attributes: { exclude: ['password', 'auth_token', 'fcm_token'] },
            where: { phone_code: phoneCode, phone_number: phoneNumber, deleted_at: null },
            raw: true
        });
        if(!result)return false;
        return result ;
    } catch (error) {
        console.error("Error UsersResources@getOneByPhoneCodeAndNumber:", error);
        return false;
    }
};

export const getAllWithPagination = async (
    page: number,
    limit: number,
    filterObj: Partial<UserAttributes> = {}
): Promise<any> => {
    console.log('UsersResources@getAllWithPagination');
    try {
        let dbQuery: any = { deleted_at: null };
        if (filterObj.role) dbQuery.role = filterObj.role;

        const totalRecords = await User.count({ where: dbQuery });
        const pagination = await dataHelper.calculatePagination(totalRecords, page, limit);

        const users = await User.findAll({
            attributes: { exclude: ['password', 'auth_token', 'fcm_token'] },
            where: dbQuery,
            order: [['created_at', 'desc']],
            raw: true
        });

        return {
            data: users || [],
            pagination: {
                total: totalRecords,
                current_page: pagination.currentPage,
                total_pages: pagination.totalPages,
                per_page: pagination.limit
            }
        };
    } catch (error) {
        console.error("Error UsersResources@getAllWithPagination:", error);
        return false;
    }
};

export const isUserExist = async (columnName: string, columnValue: any, userId: number | false = false): Promise<boolean> => {
    console.log('UsersResources@isUserExist');
    try {
        let query: any = { [columnName]: columnValue, deleted_at: null };
        if (userId) query.id = { [Op.ne]: userId };
        const count = await User.count({ where: query });
        return count > 0;
    } catch (error) {
        console.error("Error UsersResources@isUserExist:", error);
        return false;
    }
};

export const updateOne = async (id: number, data: Partial<UserAttributes>): Promise<UserAttributes | boolean> => {
    console.log('UsersResources@updateOne');
    try {
        if (!id || !data) throw new Error('Data is required');

        await User.update(data, { where: { id } });
        const updatedUser = await User.findOne({ where: { id }, raw: true });
        return updatedUser || false;
    } catch (error) {
        console.error("Error UsersResources@updateOne:", error);
        return false;
    }
};

export const getFormattedData = async (userObj: UserAttributes | null): Promise<Partial<UserAttributes>> => {
    console.log('UsersResources@getFormattedData');
    if (!userObj) throw new Error('userObj is required');

    return {
        id: userObj.id,
        first_name: userObj.first_name ,
        last_name: userObj.last_name || null,
        email: userObj.email,
        role: userObj.role,
        status: userObj.status,
        phone_number: userObj.phone_number,
        phone_code: userObj.phone_code,
        is_email_verified: userObj.is_email_verified,
        created_at: userObj.created_at,
        updated_at: userObj.updated_at,
        deleted_at: userObj.deleted_at
    };
};

export const deleteOne = async (id: number): Promise<boolean> => {
    console.log('UsersResources@deleteOne');
    try {
        const result = await User.destroy({ where: { id } });
        return !!result;
    } catch (error) {
        console.error("Error UsersResources@deleteOne:", error);
        return false;
    }
};