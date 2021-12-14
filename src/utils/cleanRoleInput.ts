import { Role } from "@/models/role";

/**
 * function that cleans the data before it's sent to the backend, or after it's
 * received from the backend
 *
 * before sending data to the backend for an insert or update operation, we need
 * to remove from the input those fields that cannot be updated. If we send those
 * fields the backend will return an error as there is validation prohibiting the
 * user to insert or update certain fields
 */
export function cleanRoleInput(roleInput: Role) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, authorId, createdDate, ...role } = roleInput;

  return role;
}
