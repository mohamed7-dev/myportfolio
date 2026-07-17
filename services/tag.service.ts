import { filterUnique } from "@/lib/utils/filter-unique";
import { Tag } from "@/orm/entities/tag/tag.entity";
import { ormService } from "@/orm/orm.service";

export function tagService() {
  return {
    async createTagsFromValues(values: string[]) {
      return await _createTagsFromValues(values);
    },
  };
}

async function _createTagsFromValues(values: string[]) {
  return Promise.all(
    filterUnique(values).map(async (value) => _createTagsFromValue(value)),
  );
}

async function _createTagsFromValue(value: string) {
  const repo = await ormService.getRepository(Tag);
  const tag = await repo.findOne({
    where: {
      value,
    },
  });

  if (tag) return tag;

  return await repo.save(new Tag({ value }));
}
