'use strict';
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
/**
 * @type {import('strapi').Strapi strapi
 * }
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

const formatError = error => [
    { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {

    //controller for /userprofiles =>create
    async create(ctx) {
        let { body: bodyReq } = ctx.request;
        if (bodyReq) {
            if (bodyReq.gggg) {
                return ctx.badRequest(
                    null,
                    formatError({
                        id: 'Auth.form.error.address',
                        message: 'Address field cannot be empty.',
                        field: ['address'],
                    })
                );
            }
            let authPermissionController = strapi.plugins['users-permissions'].controllers.auth;
            await authPermissionController.register(ctx);
            let res = ctx.response
            console.log(res)
            if (res.status >= 200 && res.status < 300) {
                let { user: userSaved } = res.body
                if (userSaved) {
                    let { password, username, ...rest } = bodyReq
                    let { id: idOfUser, restOfUser } = userSaved
                    let userprofileId = await (await strapi.query('userprofile').
                        create({ userId: idOfUser, ...rest })).id;
                    let userprofile = await strapi.query("userprofile").findOne({ id: userprofileId })
                    let { id: profileId, ...restOfProfile } = userprofile
                    ctx.response._body.user = { ...restOfUser, ...restOfProfile, profileId }
                }
            }
            else {
                console.log("unable to save")
            }
        } else {
            return ctx.badRequest(
                null,
                formatError({
                    id: 'Auth.form.error.multiple_fields',
                    message: 'User fields are empty.',
                    field: ['username', 'password'],
                })
            );
        }
    },
    // controller for /api/userprofiles/login
    async login(ctx) {
        if (ctx.request) {
            let { identifier, password } = ctx.request.body;
            let authLoginPermissionController = strapi.plugins['users-permissions'].controllers.auth;

            await authLoginPermissionController.callback(ctx);
            let status = ctx.response.status
            if (status >= 200 && status < 300) {
                let { jwt, user } = ctx.response.body;
                console.log(ctx.response.body)
                if (user) {
                    const result = await strapi.query('userprofile').model.query(function (qb) {
                        qb.where({ userId: user.id });
                    }).fetchAll();
                    console.log(jwt)
                    const fields = result && result.toJSON();
                    if (fields.length > 0) {
                        let profileData = fields[0]
                        let { id: profileId, ...restOfProfile } = profileData
                        console.log(jwt)
                        user = { ...user, ...restOfProfile, profileId }
                        console.log(user.username)
                        ctx.response._body = {
                            jwt, user
                        }
                    } else {
                        await strapi.query('userprofile').model.query(
                            /**
                             * @param {import("knex").QueryBuilder} knex
                             */
                            async function (knex) {
                                let { id: userId, email, ...restOfUser } = user
                                let profiles = await knex.insert({ userId, email })
                                if (profiles.length > 0) {
                                    //console.log("3ajfasgjasghvhasvhs")
                                    const result = await strapi.query('userprofile').model.
                                        query(function (qb) {
                                            qb.where({ userId });
                                        }).fetchAll();

                                    const fields = result && result.toJSON();
                                    let { id: profileId, ...rest } = fields[0];
                                    let userSaved = { ...user, ...rest, profileId }
                                    console.log(restOfUser)
                                    res.body = userSaved
                                    ctx.response._body.user = userSaved
                                }

                            });
                    }
                }
            }
            else {
                console.log(ctx.response.status)
            }
        } else {
            const result = await strapi.query('userprofile').model.fetchAll();
            const fields = result && result.toJSON();
            console.log(fields);
            return fields;
        }
    },

    // controller for GET /api/userprofiles/id
    /**
     * 
     * @param {koa} ctx 
     * @returns 
     */
    async findOne(ctx) {
        if (ctx.request) {
            // console.log(Object.keys(ctx))
            let { url: initialUrl } = ctx.request;
            let userId = initialUrl.split("/")[2]    //e.g is in /userprofiles/1 => ["","userprofile",1]
            console.log(userId)

            const result = await strapi.query('userprofile').model.query(function (qb) {
                qb.where({ id: userId });
            }).fetchAll();

            const fields = result && result.toJSON();
            console.log(fields)
            if (fields.length > 0) {
                let profileData = fields[0]
                let { id: profileId, ...restOfProfile } = profileData

                let userprofile = { ...restOfProfile, profileId }

                let userResult = await strapi.plugins["users-permissions"].models["user"].query(function (qb) {
                    qb.where({ id: userprofile.userId });
                }).fetchAll();
                const userFields = userResult && userResult.toJSON();
                let { id: userId, restOfUser } = userFields[0]
                userprofile = { ...restOfUser, userId, ...userprofile }
                ctx.response._body = userprofile
                ctx.response.status = 200
            } else {
            }

        } else {
            const result = await strapi.query('userprofile').model.fetchAll();
            const fields = result && result.toJSON();
            console.log(fields);
            return fields;
        }
    },
};
