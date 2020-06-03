/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-unresolved */

// @ts-ignore
import { DEVELOPER_ROLE_ID, SUPPORT_GUILD } from '@data/config';
// @ts-ignore
import { getDevs } from '@util/Util';
import { PermissionString, Client } from 'discord.js';
import { TFunction } from 'i18next';

/**
 * Contains various permission related utility methods.
 * @class PermissionsUtil
 */
export default class PermissionsUtil {
  /**
   * Checks if a user ID is a developer.
   * @param userID The user's ID.
   * @param client The Client.
   * @returns If the user is a developer.
   */
  static verifyDev(userID: string, client: Client): boolean {
    const guildClient = client.guilds.cache.get(SUPPORT_GUILD);
    const devRole = guildClient && guildClient.roles.cache.get(DEVELOPER_ROLE_ID);

    const roleCondition = devRole && devRole.members.has(userID);
    const devs = getDevs();
    const idCondition = devs && devs.includes(userID);

    return !!(roleCondition || idCondition);
  }

  static normalize(permissions: PermissionString[], t: TFunction): string[] {
    return permissions.map((p) => t(`permissions:${p}`));
  }
}
