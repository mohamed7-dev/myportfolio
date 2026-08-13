import { wrapService } from "@/api/common/create-router";
import { Badge } from "@/components/ui/badge";
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
        <Badge variant="neutral" key={skill.id}>
          {skill.name}
        </Badge>
      ))}
    </div>
  );
}
