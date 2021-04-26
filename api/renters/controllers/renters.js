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
            if (!ctx.state.user) {
                //console.log(userPermissionController)
                await userPermissionController.create(ctx);
            }
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
                            knex.insert({ userId: user.id, ...body }).
                                onConflict(['userId', 'email']).ignore().then(renters => {
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
    // controller for /api/renters/login
    async usernameOrEmail(ctx) {
        if (ctx.request) {
            // console.log(Object.keys(ctx))
            let { identifier, password } = ctx.request.body;
            console.log(ctx.request.body)
            //console.log(strapi.plugins['users-permissions'].controllers)
            let authLoginPermissionController = strapi.plugins['users-permissions'].controllers.auth;

            await authLoginPermissionController.callback(ctx);
            let auth = ctx.response._body;
            console.log(Object.keys(ctx.response._body))
            auth.extra = "ywywywy"
            if (auth) {
                const result = await strapi.query('renters').model.query(function (qb) {
                    qb.where({ user_id: auth.user.id });
                }).fetchAll();

                const fields = result && result.toJSON();
                console.log(fields);
                if (fields.length > 0) {
                    console.log("Not a renter...")
                    ctx.response._body.user = {
                        ...ctx.response._body.user, renterInfo: {
                            ...fields[0]
                        }
                    }
                } else {
                    console.log("Not a renter...")
                    ctx.response.res.statusCode = 404;
                    ctx.response.res.statusMessage = "No renter account found.";
                    ctx.response._body = {
                        err: "No renter account found that matches."
                    }
                }
            }


        } else {
            const result = await strapi.query('renters').model.fetchAll();
            const fields = result && result.toJSON();
            console.log(fields);
            return fields;
        }
    }
};
