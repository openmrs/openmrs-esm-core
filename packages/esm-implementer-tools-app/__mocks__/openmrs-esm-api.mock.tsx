export function openmrsFetch() {
  return new Promise(() => {});
}

export const UserHasAccessReact = jest.fn().mockImplementation((props: any) => {
  return props.children;
});
