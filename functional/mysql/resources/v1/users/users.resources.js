const Op = require('sequelize').Op;

const { where } = require('sequelize');
/** Custom Require **/ 
const dataHelper = require('../../../helpers/v1/data.helpers');
const User = require('./user.model');

const IN_ACTIVE = '0';
const ACTIVE = '1';
const BLOCKED = '2';
const DELETED = '3';
const statuses = Object.freeze({
    IN_ACTIVE,
    ACTIVE,
    BLOCKED,
    DELETED
});

const USER = 'user';
const ADMIN = 'admin';
const roles = Object.freeze({
    USER,
    ADMIN
});

const createOne = async (data) => {
    console.log('UsersResources@createOne');

    try {
        if (!data || data === '') {
            throw new Error('Data is required');
        }

        // Insert the user data 
        let user = await User.create(data);
        if (!user) {
            return false;
        }

        return user;

    } catch (error) {
        console.log("Error UsersResources@createOne: ", error);
        return false;
    }
}

const getOneByColumnNameAndValue = async (columnName, columnValue) => {
    console.log('UsersResources@getOneByColumnNameAndValue');

    try {
        let result = await User.findOne({
            where: {
                [columnName]: columnValue,
                deleted_at: null
            },
            raw: true
        })
        
        if (!result) {
            return false;
        }

        return result;

    } catch (error) {
        
        console.log("Error UsersResources@getOneByColumnNameAndValue: ", error);
        return false;
    }
}

const getOneByPhoneCodeAndNumber = async (phoneCode, phoneNumber) => {
    console.log('UsersResources@getOneByPhoneCodeAndNumber');

    try{
        let result = await User.findOne({
            attributes: { 
                exclude: ['password', 'auth_token', 'fcm_token'] 
            },
            where: {
                phone_code: phoneCode,
                phone_number: phoneNumber,
                deleted_at: null
            },
            raw: true
        });

        if (!result) {
            return false;
        }

        return result;
    
    } catch (error) {
        
        console.log("Error UsersResources@getOneByPhoneCodeAndNumber: ", error);
        return false;
    }
}

const getAllWithPagination = async (page, limit, filterObj = {}) => {
    console.log('UsersResources@getAllWithPagination');

    try{
        let resObj;
        let dbQuery = {
            deleted_at: null
        };

        if(filterObj?.role){
            dbQuery = {
                ...dbQuery,
                role: filterObj.role
            };
        }

        let totalRecords = await User.count({
            where: dbQuery
        });

        let pagination = await dataHelper.calculatePagination(totalRecords, page, limit);

        let users = await User.findAll({
            attributes: { 
                exclude: ['password', 'auth_token', 'fcm_token'] 
            },
            where: dbQuery,
            order: [['created_at', 'desc']],
            raw: true
        })
        
        if (!users) {
            resObj = {
                data: []
            };
        }
        else {
            resObj = {
                data: users,
                pagination: {
                    total: totalRecords,
                    current_page: pagination.currentPage,
                    total_pages: pagination.totalPages,
                    per_page: pagination.limit
                }
            };
        }

        return resObj;

    } catch (error) {
        
        console.log("Error UsersResources@getAllWithPagination: ", error);
        return false;
    }
}

const isUserExist = async (columnName, columnValue, userId = false) => {
    console.log('UsersResources@isUserExist');

    try{
        let query = {
            [columnName]: columnValue,
            deleted_at: null
        }

        if (userId) {
            query = {
                ...query,
                id: {
                    [Op.ne]: userId
                }
            }
        }

        let usersCount = await User.count({
            where: query
        });

        if (!usersCount || usersCount <= 0) {
            return false;
        }

        return true;

    } catch (error) {
        
        console.log("Error UsersResources@isUserExist: ", error);
        return false;
    }
}

const updateOne = async (id, data) => {
    console.log('UsersResources@updateOne');

    try{
        if ((!id || id === '') || (!data || data === '')) {
            throw new Error('data is required');
        }

        let hasUpdated = await User.update(data, {
            where: {
                id: id
            }
        })

        if (!hasUpdated) {
            return false;
        }

        const updatedUser = await User.findOne({ 
            where: { id: id },
            raw: true
        });

        return updatedUser;

    } catch (error) {
        
        console.log("Error UsersResources@updateOne: ", error);
        return false;
    }
}

const getFormattedData = async (userObj = null) => {
    console.log('UsersResources@getFormattedData');

    if (!userObj || userObj === '') {
        throw new Error('userObj is required');
    }

    let result = {
        id: userObj.id,
        first_name: userObj?.first_name || null,
        last_name: userObj?.last_name || null,
        email: userObj.email,
        role: userObj.role,
        status: userObj.status,
        phone_number: userObj.phone_number,
        phone_code: userObj.phone_code,
        is_email_verified: userObj.is_email_verified,
        created_at: userObj.created_at,
        updated_at: userObj.updated_at,
        deleted_at: userObj.deleted_at,
    };

    return result
}

const deleteOne = async (id) => {
    console.log("UsersResources@deleteOne");

    try{
        let hasDeleted = await User.destroy({
            where: { 
                id: id 
            } 
        })

        if (!hasDeleted) {
            return false
        }

        return hasDeleted

    } catch (error) {
        
        console.log("Error UsersResources@deleteOne: ", error);
        return false;
    }
}

module.exports =  {
    createOne,
    getOneByColumnNameAndValue,
    getOneByPhoneCodeAndNumber,
    isUserExist,
    updateOne,
    getFormattedData,
    deleteOne,
    getAllWithPagination,
    statuses,
    roles
}
