'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    updateUserRole: async (userid, roleType) => {
        const role = await strapi.query('role', 'users-permissions').findOne({ type:roleType }, []);
    if ( role ) {
        strapi.query('user',  'users-permissions').update({ id: userid }, { role: role.id });
        return true;
    }

    return false;
}
};
