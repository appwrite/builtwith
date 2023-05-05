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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.5604 1.25555C14.0599 1.41302 14.3996 1.87627 14.3996 2.40004V8.40004L19.1996 8.40004C19.6471 8.40004 20.0574 8.64899 20.264 9.04587C20.4706 9.44274 20.4393 9.92163 20.1827 10.2882L11.7827 22.2882C11.4823 22.7173 10.9384 22.902 10.4388 22.7445C9.93931 22.5871 9.59961 22.1238 9.59961 21.6L9.59961 15.6H4.79961C4.35216 15.6 3.94188 15.3511 3.73524 14.9542C3.5286 14.5573 3.55994 14.0784 3.81653 13.7119L12.2165 1.71188C12.5169 1.2828 13.0608 1.09809 13.5604 1.25555Z"
        fill="currentColor"
      />
    </svg>
  );
});
