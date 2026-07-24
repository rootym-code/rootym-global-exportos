import followUpRepositoryQuery from "./followup.repository.query-builder";

import followUpRepositoryMutation from "./followup.repository.mutation";

import followUpRepositoryTransaction from "./followup.repository.transaction";

import type {
  FollowUpCreateInput,
  FollowUpUpdateInput,
  FollowUpFindManyArgs,
  FollowUpFindUniqueArgs,
  FollowUpCountArgs,
  FollowUpUncheckedCreateInput,
  FollowUpUncheckedUpdateInput,
} from "./followup.repository.types";

export class FollowUpRepository {
  async findMany(
    args: FollowUpFindManyArgs = {},
  ) {
    return followUpRepositoryQuery.findMany(
      args,
    );
  }

  async findUnique(
    args: FollowUpFindUniqueArgs,
  ) {
    return followUpRepositoryQuery.findUnique(
      args,
    );
  }

  async count(
    args: FollowUpCountArgs = {},
  ) {
    return followUpRepositoryQuery.count(
      args,
    );
  }

  async create(
    data:
      | FollowUpCreateInput
      | FollowUpUncheckedCreateInput,
  ) {
    return followUpRepositoryMutation.create(
      data,
    );
  }

  async update(
    id: string,
    data:
      | FollowUpUpdateInput
      | FollowUpUncheckedUpdateInput,
  ) {
    return followUpRepositoryMutation.update(
      id,
      data,
    );
  }

  async delete(
    id: string,
  ) {
    return followUpRepositoryMutation.delete(
      id,
    );
  }

  async transaction<T>(
    callback: Parameters<
      typeof followUpRepositoryTransaction.execute
    >[0],
  ): Promise<T> {
    return await followUpRepositoryTransaction.execute(
      callback,
    ) as T;
  }
}

const followUpRepository =
  new FollowUpRepository();

export default followUpRepository;