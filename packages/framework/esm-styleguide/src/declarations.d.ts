declare module '*.css' {
  interface Styles {
    [key: string]: string;
  }
  const content: Styles;
  export default content;
}
declare module '*.scss' {
  interface Styles {
    [key: string]: string;
  }
  const content: Styles;
  export default content;
}
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.png';
