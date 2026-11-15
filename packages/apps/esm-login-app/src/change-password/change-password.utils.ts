// Blank values are rejected with `refine` rather than `.trim()`, which would change the submitted
// password. The login form doesn't trim, so a trimmed password wouldn't match what the user typed.
export const isNotBlank = (value: string) => value.trim().length > 0;
