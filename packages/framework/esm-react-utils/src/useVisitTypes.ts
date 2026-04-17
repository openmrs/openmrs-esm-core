/** @module @category API */
import { getVisitTypes, type VisitType } from '@openmrs/esm-emr-api';
import { useEffect, useState } from 'react';

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
  const [visitTypes, setVisitTypes] = useState<Array<VisitType>>([]);

  useEffect(() => {
    const visitTypesSub = getVisitTypes().subscribe(
      (visitTypes) => {
        setVisitTypes(visitTypes);
      },
      (error) => console.error(error),
    );

    return () => visitTypesSub.unsubscribe();
  }, []);

  return visitTypes;
}
