import type { FindOptionsRelations } from "typeorm";
import type { RequestContext } from "@/api/request-context/request-context";
import type { TagListInputSchema } from "@/lib/dto/tag";
import { filterUnique } from "@/lib/utils/filter-unique";
import { Tag } from "@/orm/entities/tag/tag.entity";
import { ormService } from "@/orm/orm.service";
import { listQueryBuilder } from "../helpers/list-query-builder/list-query-builder.service";

class TagService {
  public async createTagsFromValues(ctx: RequestContext, values: string[]) {
    return Promise.all(
      filterUnique(values).map(async (value) =>
        this.createTagsFromValue(ctx, value),
      ),
    );
  }

  async find(
    ctx: RequestContext,
    options: TagListInputSchema,
    relations?: FindOptionsRelations<Tag>,
  ) {
    const qb = await listQueryBuilder.build(Tag, options, {
      ctx,
      alias: "tag",
      relations: {
        ...relations,
      },
    });

    return await qb.getManyAndCount().then((result) => {
      return {
        items: result[0],
        itemsCount: result[1],
      };
    });
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
