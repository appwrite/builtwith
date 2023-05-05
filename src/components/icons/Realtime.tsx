import { component$ } from "@builder.io/qwik";

export default component$((props: { active: boolean; disabled?: boolean }) => {
  return (
    <svg
      style={
        props.disabled
          ? "color: hsl(var(--color-neutral-200))"
          : props.active
          ? "color: hsl(var(--color-primary-200))"
          : "color: hsl(var(--color-neutral-150))"
      }
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.0004 21.6C17.3023 21.6 21.6004 17.302 21.6004 12C21.6004 6.69809 17.3023 2.40002 12.0004 2.40002C6.69846 2.40002 2.40039 6.69809 2.40039 12C2.40039 17.302 6.69846 21.6 12.0004 21.6ZM13 7.20007C13 6.64779 12.5523 6.20007 12 6.20007C11.4477 6.20007 11 6.64779 11 7.20007V12.0001C11 12.2653 11.1054 12.5196 11.2929 12.7072L14.687 16.1013C15.0775 16.4918 15.7107 16.4918 16.1012 16.1013C16.4917 15.7108 16.4917 15.0776 16.1012 14.6871L13 11.5859V7.20007Z"
        fill="currentColor"
      />
    </svg>
  );
});
