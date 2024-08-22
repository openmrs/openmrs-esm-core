[@openmrs/esm-framework](../API.md) / OpenMRSPaginatedResponse

# Interface: OpenMRSPaginatedResponse<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### UI Properties

- [links](OpenMRSPaginatedResponse.md#links)
- [results](OpenMRSPaginatedResponse.md#results)
- [totalCount](OpenMRSPaginatedResponse.md#totalcount)

## UI Properties

### links

• **links**: { `rel`: ``"prev"`` \| ``"next"`` ; `uri`: `string`  }[]

#### Defined in

[packages/framework/esm-react-utils/src/useServerPagination.ts:8](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerPagination.ts#L8)

___

### results

• **results**: `T`[]

#### Defined in

[packages/framework/esm-react-utils/src/useServerPagination.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerPagination.ts#L7)

___

### totalCount

• **totalCount**: `number`

#### Defined in

[packages/framework/esm-react-utils/src/useServerPagination.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerPagination.ts#L9)
