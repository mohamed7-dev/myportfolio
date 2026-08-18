import type { RequestContext } from "@/api/request-context/request-context";
import { filterUnique } from "@/lib/utils/filter-unique";
import { Tag } from "@/orm/entities/tag/tag.entity";
import { ormService } from "@/orm/orm.service";

class TagService {
  public async createTagsFromValues(ctx: RequestContext, values: string[]) {
    return Promise.all(
      filterUnique(values).map(async (value) =>
        this.createTagsFromValue(ctx, value),
      ),
    );
  }

  private async createTagsFromValue(ctx: RequestContext, value: string) {
    const repo = await ormService.getRepository(ctx, Tag);
    const tag = await repo.findOne({
      where: {
        value,
      },
    });

    if (tag) return tag;

    return await repo.save(new Tag({ value }));
  }
}

export const tagService = new TagService();
