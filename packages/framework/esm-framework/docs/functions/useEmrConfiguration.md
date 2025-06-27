[O3 Framework](../API.md) / useEmrConfiguration

# Function: useEmrConfiguration()

> **useEmrConfiguration**(): `object`

Defined in: [packages/framework/esm-react-utils/src/useEmrConfiguration.ts:158](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L158)

React hook for fetching and managing OpenMRS EMR configuration

## Returns

`object`

Object containing:
  - emrConfiguration: EmrApiConfigurationResponse | undefined - The EMR configuration data
  - isLoadingEmrConfiguration: boolean - Loading state indicator
  - mutateEmrConfiguration: Function - SWR's mutate function for manual revalidation
  - errorFetchingEmrConfiguration: Error | undefined - Error object if request fails

### emrConfiguration

> **emrConfiguration**: `undefined` \| [`EmrApiConfigurationResponse`](../interfaces/EmrApiConfigurationResponse.md) = `swrData.data.data`

### errorFetchingEmrConfiguration

> **errorFetchingEmrConfiguration**: `undefined` \| `Error` = `swrData.error`

### isLoadingEmrConfiguration

> **isLoadingEmrConfiguration**: `boolean` = `swrData.isLoading`

### mutateEmrConfiguration

> **mutateEmrConfiguration**: `KeyedMutator`\<`FetchResponse`\<[`EmrApiConfigurationResponse`](../interfaces/EmrApiConfigurationResponse.md)\>\> = `swrData.mutate`
