declare namespace JSX {
  interface IntrinsicElements {
    "import-map-overrides-list": any;
  }
}

declare module "*.css" {
  const styles: any;
  export default styles;
}
