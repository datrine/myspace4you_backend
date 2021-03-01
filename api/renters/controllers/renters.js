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

    //controller for /renters =>create
    async create(ctx) {
        let { body } = ctx.request;
        if (body) {
            if (body.gggg) {
                return ctx.badRequest(
                    null,
                    formatError({
                        id: 'Auth.form.error.address',
                        message: 'Address field cannot be empty.',
                        field: ['address'],
                    })
                );
            }
            let userPermissionController = strapi.plugins['users-permissions'].controllers.user;
            //console.log(userPermissionController)
            await userPermissionController.create(ctx);
            let res = ctx.response
            if (res.status >= 200 && res.status < 300) {
                let user = res.body
                if (user) {
                    console.log(user)
                    strapi.query('renters').model.query(
                        /**
                         * @param {import("knex").QueryBuilder} knex
                         */
                        function (knex) {
                            knex.insert({ user_id: user.id, ...body }).then(renters => {
                                console.log(renters)
                                if (renters.length > 0) {

                                }
                            }).catch(err => {
                                console.log(err)
                            });
                        });
                }
                else {
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
    // controller for /api/renters/
    async usernameOrEmail(ctx) {
        if (ctx.query) {
            let { params } = ctx;
            console.log(params)
            const result = await strapi.query('renters').model.query(function (qb) {
                qb.where({ username: params.usernameOrEmail })
                    .orWhere({ email: params.usernameOrEmail });
            }).fetchAll();

            const fields = result && result.toJSON();
            console.log(fields);
            return fields;
        } else {
            const result = await strapi.query('renters').model.fetchAll();
            const fields = result && result.toJSON();
            console.log(fields);
            return fields;
        }
    }
};
