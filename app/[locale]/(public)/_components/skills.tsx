import { wrapService } from "@/api/common/create-router";
import { visitorService } from "@/services/domain/visitor.service";

export async function Skills() {
  const getFeaturedSkills = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getFeaturedSkills,
  });

  const skills = await getFeaturedSkills();
  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      {skills.items?.map((skill) => (
        <span
          key={skill.id}
          className="px-3 py-1 bg-background text-foreground rounded-base text-sm font-base"
        >
          {skill.name}
        </span>
      ))}
    </div>
  );
}
