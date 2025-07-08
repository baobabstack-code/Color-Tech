"use strict";

module.exports = (plugin) => {
  plugin.controllers.role.create = async (ctx) => {
    const role = await plugin.controllers.role.create(ctx);
    if (role.type === 'public') {
      const servicePermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
        where: {
          action: { $in: ['api::service.service.find', 'api::service.service.findOne'] },
        },
      });
      const serviceCategoryPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
        where: {
            action: { $in: ['api::service-category.service-category.find', 'api::service-category.service-category.findOne'] },
        },
      });
      const allPermissions = [...servicePermissions, ...serviceCategoryPermissions];
      await strapi.db.query('plugin::users-permissions.role').update({
        where: { id: role.id },
        data: {
          permissions: [...role.permissions.map(p => p.id), ...allPermissions.map(p => p.id)],
        },
      });
    }
    return role;
  };

  return plugin;
};