/** @module @category API */
import useSWRImmutable from 'swr/immutable';
import { getVisitTypes, visitTypesUrl, type VisitType } from '@openmrs/esm-emr-api';

const noVisitTypes: Array<VisitType> = [];

/**
 * A React hook that fetches and returns all available visit types from the
 * OpenMRS server. The data is fetched once when the component mounts.
 *
 * @returns An array of VisitType objects. Returns an empty array while loading
 *   or if an error occurs.
 *
 * @example
 * ```tsx
 * import { useVisitTypes } from '@openmrs/esm-framework';
 * function VisitTypeSelector() {
 *   const visitTypes = useVisitTypes();
 *   return (
 *     <select>
 *       {visitTypes.map((vt) => (
 *         <option key={vt.uuid} value={vt.uuid}>{vt.display}</option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useVisitTypes() {
  const { data } = useSWRImmutable(visitTypesUrl, getVisitTypes);
  return data ?? noVisitTypes;
}
