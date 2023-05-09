import { component$ } from "@builder.io/qwik";
// import { routeLoader$ } from "@builder.io/qwik-city";
// import { AppwriteService } from "~/AppwriteService";

// export const useProjectData = routeLoader$(async ({ params }) => {
//   return {
//     project: await AppwriteService.getProject(params.projectId),
//   };
// });

export default component$(() => {
//   const projectData = useProjectData();

  return (
    <>
      <ul
        class="grid-box"
        style="--grid-gap:1rem; --grid-item-size:32rem; --grid-item-size-small-screens:24rem;"
      >
        <li>
          <section class="card">
            <table class="table is-remove-outer-styles">
              <tbody class="table-tbody">
                <tr class="table-row">
                  <td class="table-col">
                    <span class="text">Framework</span>
                  </td>
                  <td class="table-col u-overflow-visible">
                    <span class="text">React</span>
                  </td>
                </tr>
                <tr class="table-row">
                  <td class="table-col">
                    <span class="text">UI Library</span>
                  </td>
                  <td class="table-col u-overflow-visible">
                    <span class="text">Taiwind</span>
                  </td>
                </tr>
                <tr class="table-row">
                  <td class="table-col">
                    <span class="text">Use Case</span>
                  </td>
                  <td class="table-col u-overflow-visible">
                    <span class="text">Demo</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="u-flex u-margin-block-start-16">BUTTONS</div>
          </section>
        </li>
        <li>
          <div class="card">card</div>
        </li>
      </ul>
    </>
  );
});
