'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
module.exports = {
    updateUserRole: async ctx => {
        console.log(ctx.body)
        return await strapi.services.auth.updateUserRole(ctx.request.body.user,
            ctx.request.body.roleType);

    },
};