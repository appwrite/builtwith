import { component$ } from "@builder.io/qwik";

export default component$((props: { active: boolean; disabled?: boolean }) => {
  return (
    <svg
    class={`c-service ${
      props.disabled ? "is-disabled" : props.active ? "is-active" : ""
    }`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.80039 3.59998C3.47491 3.59998 2.40039 4.67449 2.40039 5.99998C2.40039 7.32546 3.47491 8.39998 4.80039 8.39998H19.2004C20.5259 8.39998 21.6004 7.32546 21.6004 5.99998C21.6004 4.67449 20.5259 3.59998 19.2004 3.59998H4.80039Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.60039 9.59998H20.4004V18C20.4004 19.3255 19.3259 20.4 18.0004 20.4H6.00039C4.67491 20.4 3.60039 19.3255 3.60039 18V9.59998ZM9.60039 13.2C9.60039 12.5372 10.1376 12 10.8004 12H13.2004C13.8631 12 14.4004 12.5372 14.4004 13.2C14.4004 13.8627 13.8631 14.4 13.2004 14.4H10.8004C10.1376 14.4 9.60039 13.8627 9.60039 13.2Z"
        fill="currentColor"
      />
    </svg>
  );
});
