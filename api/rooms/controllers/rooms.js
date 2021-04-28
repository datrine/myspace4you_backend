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

    //controller for POST /rooms =>create room
    async create(ctx) {
        let { body: bodyReq } = ctx.request;
        console.log(ctx.request.headers)
        if (bodyReq) {
            /*
            if (!bodyReq.userId) {
                return ctx.badRequest(
                    null,
                    formatError({
                        id: 'Auth.form.error.userId',
                        message: 'UserId field cannot be empty.',
                        field: ['userId'],
                    })
                );
            }*/
            let renter = await strapi.controllers.renters.create(ctx);
            let res = ctx.response
            if (res.status >= 200 && res.status < 300) {
                if (!renter) {
                    res.status = 501
                    return;
                }
                console.log("renter id : "+renter.id)
                let room = await strapi.query('rooms').
                create({...bodyReq, renterId: renter.id,userId:renter.userId, })
                res.body = room
                res.status = 200
                return room
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
