import type { LayoutType } from '@openmrs/esm-framework';

export const isDesktop = (layout: LayoutType) => layout === 'small-desktop' || layout === 'large-desktop';
