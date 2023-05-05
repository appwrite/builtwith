import { component$ } from "@builder.io/qwik";
import ProjectFeatured from "~/components/layout/ProjectFeatured";
import Group from "~/components/layout/Group";
import ProjectList from "~/components/layout/ProjectList";
import ServiceList from "~/components/layout/ServiceList";
import TagList from "~/components/layout/TagList";

export default component$(() => {
  return (
    <>
      <div class="u-flex-vertical u-gap-32">
        <Group title="Loved by Appwrite" action="none">
          <ProjectFeatured></ProjectFeatured>
        </Group>

        <Group title="New and Shiny" action="showAll">
          <ProjectList />
        </Group>

        <Group title="Trend Zone" action="showAll">
          <ProjectList />
        </Group>

        <Group title="Made with React" action="showAll">
          <ProjectList />
        </Group>

        <Group title="Based on Services" action="showAll">
          <ServiceList />
        </Group>

        <Group title="Updated and Upgraded" action="showAll">
          <ProjectList />
        </Group>

        <Group title="Surprise Me" action="showAll">
          <ProjectList />
        </Group>

        <Group title="Made with Tailwind" action="showAll">
          <ProjectList />
        </Group>

        <Group title="Common Use Cases" action="showAll">
          <TagList />
        </Group>

        <Group title="Your Picks" action="showAll">
          <ProjectList />
        </Group>

        <Group title="Seen Recently" action="showAll">
          <ProjectList />
        </Group>
      </div>
    </>
  );
});
