import {DataTypes, Sequelize, Model, BuildOptions} from 'sequelize'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'

export interface UserAttributes {
    user_id?: number,
    username: string,
    password: string,
    email: string,
    role?: 'USER' | 'ADMIN',
    is_enabled?: boolean,
    is_blocked?: boolean,
    createdAt?: Date,
    updatedAt?: Date,
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {
}

// export class UserClass extends Model<UserModel, UserAttributes> {
// }

export type UserStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): UserModel
}

export function UserFactory(sequelize: Sequelize): UserStatic {
    const User = <UserStatic>sequelize.define("users", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'USER'
        },
        is_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    })

    User.beforeValidate(async function (user) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
    })

    User.prototype.comparePassword = async function (candidatePassword: string): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, this.password)
    }

    return User
}

