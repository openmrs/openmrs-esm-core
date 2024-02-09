export interface FHIRLocationResource {
  resource: {
    id: string;
    name: string;
    resourceType: string;
    status: 'active' | 'inactive';
    meta?: {
      tag?: Array<{
        code: string;
        display: string;
        system: string;
      }>;
    };
  };
}
