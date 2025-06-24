[@openmrs/esm-framework](../API.md) / EmrApiConfigurationResponse

# Interface: EmrApiConfigurationResponse

Add other properties as needed. Maintain alphabetical order. Keep in lockstep with the customRepresentation below.

For all available configuration constants and global property keys, see:

**`see`** https://github.com/openmrs/openmrs-module-emrapi/blob/master/api/src/main/java/org/openmrs/module/emrapi/EmrApiConstants.java

## Table of contents

### API Properties

- [admissionDecisionConcept](EmrApiConfigurationResponse.md#admissiondecisionconcept)
- [admissionEncounterType](EmrApiConfigurationResponse.md#admissionencountertype)
- [admissionForm](EmrApiConfigurationResponse.md#admissionform)
- [atFacilityVisitType](EmrApiConfigurationResponse.md#atfacilityvisittype)
- [bedAssignmentEncounterType](EmrApiConfigurationResponse.md#bedassignmentencountertype)
- [cancelADTRequestEncounterType](EmrApiConfigurationResponse.md#canceladtrequestencountertype)
- [checkInClerkEncounterRole](EmrApiConfigurationResponse.md#checkinclerkencounterrole)
- [checkInEncounterType](EmrApiConfigurationResponse.md#checkinencountertype)
- [clinicianEncounterRole](EmrApiConfigurationResponse.md#clinicianencounterrole)
- [conceptSourcesForDiagnosisSearch](EmrApiConfigurationResponse.md#conceptsourcesfordiagnosissearch)
- [consultEncounterType](EmrApiConfigurationResponse.md#consultencountertype)
- [consultFreeTextCommentsConcept](EmrApiConfigurationResponse.md#consultfreetextcommentsconcept)
- [denyAdmissionConcept](EmrApiConfigurationResponse.md#denyadmissionconcept)
- [diagnosisMetadata](EmrApiConfigurationResponse.md#diagnosismetadata)
- [diagnosisSets](EmrApiConfigurationResponse.md#diagnosissets)
- [dischargeForm](EmrApiConfigurationResponse.md#dischargeform)
- [dispositionDescriptor](EmrApiConfigurationResponse.md#dispositiondescriptor)
- [dispositions](EmrApiConfigurationResponse.md#dispositions)
- [emrApiConceptSource](EmrApiConfigurationResponse.md#emrapiconceptsource)
- [exitFromInpatientEncounterType](EmrApiConfigurationResponse.md#exitfrominpatientencountertype)
- [extraPatientIdentifierTypes](EmrApiConfigurationResponse.md#extrapatientidentifiertypes)
- [fullPrivilegeLevel](EmrApiConfigurationResponse.md#fullprivilegelevel)
- [highPrivilegeLevel](EmrApiConfigurationResponse.md#highprivilegelevel)
- [identifierTypesToSearch](EmrApiConfigurationResponse.md#identifiertypestosearch)
- [inpatientNoteEncounterType](EmrApiConfigurationResponse.md#inpatientnoteencountertype)
- [lastViewedPatientSizeLimit](EmrApiConfigurationResponse.md#lastviewedpatientsizelimit)
- [metadataSourceName](EmrApiConfigurationResponse.md#metadatasourcename)
- [motherChildRelationshipType](EmrApiConfigurationResponse.md#motherchildrelationshiptype)
- [narrowerThanConceptMapType](EmrApiConfigurationResponse.md#narrowerthanconceptmaptype)
- [nonDiagnosisConceptSets](EmrApiConfigurationResponse.md#nondiagnosisconceptsets)
- [orderingProviderEncounterRole](EmrApiConfigurationResponse.md#orderingproviderencounterrole)
- [patientDiedConcept](EmrApiConfigurationResponse.md#patientdiedconcept)
- [personImageDirectory](EmrApiConfigurationResponse.md#personimagedirectory)
- [primaryIdentifierType](EmrApiConfigurationResponse.md#primaryidentifiertype)
- [sameAsConceptMapType](EmrApiConfigurationResponse.md#sameasconceptmaptype)
- [supportsAdmissionLocationTag](EmrApiConfigurationResponse.md#supportsadmissionlocationtag)
- [supportsLoginLocationTag](EmrApiConfigurationResponse.md#supportsloginlocationtag)
- [supportsTransferLocationTag](EmrApiConfigurationResponse.md#supportstransferlocationtag)
- [supportsVisitsLocationTag](EmrApiConfigurationResponse.md#supportsvisitslocationtag)
- [suppressedDiagnosisConcepts](EmrApiConfigurationResponse.md#suppresseddiagnosisconcepts)
- [telephoneAttributeType](EmrApiConfigurationResponse.md#telephoneattributetype)
- [testPatientPersonAttributeType](EmrApiConfigurationResponse.md#testpatientpersonattributetype)
- [transferForm](EmrApiConfigurationResponse.md#transferform)
- [transferRequestEncounterType](EmrApiConfigurationResponse.md#transferrequestencountertype)
- [transferWithinHospitalEncounterType](EmrApiConfigurationResponse.md#transferwithinhospitalencountertype)
- [unknownCauseOfDeathConcept](EmrApiConfigurationResponse.md#unknowncauseofdeathconcept)
- [unknownLocation](EmrApiConfigurationResponse.md#unknownlocation)
- [unknownPatientPersonAttributeType](EmrApiConfigurationResponse.md#unknownpatientpersonattributetype)
- [unknownProvider](EmrApiConfigurationResponse.md#unknownprovider)
- [visitAssignmentHandlerAdjustEncounterTimeOfDayIfNecessary](EmrApiConfigurationResponse.md#visitassignmenthandleradjustencountertimeofdayifnecessary)
- [visitExpireHours](EmrApiConfigurationResponse.md#visitexpirehours)
- [visitNoteEncounterType](EmrApiConfigurationResponse.md#visitnoteencountertype)

## API Properties

### admissionDecisionConcept

• `Optional` **admissionDecisionConcept**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L19)

___

### admissionEncounterType

• `Optional` **admissionEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L20)

___

### admissionForm

• `Optional` **admissionForm**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L21)

___

### atFacilityVisitType

• `Optional` **atFacilityVisitType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L22)

___

### bedAssignmentEncounterType

• `Optional` **bedAssignmentEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L23)

___

### cancelADTRequestEncounterType

• `Optional` **cancelADTRequestEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L24)

___

### checkInClerkEncounterRole

• `Optional` **checkInClerkEncounterRole**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L25)

___

### checkInEncounterType

• `Optional` **checkInEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L26)

___

### clinicianEncounterRole

• `Optional` **clinicianEncounterRole**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L27)

___

### conceptSourcesForDiagnosisSearch

• `Optional` **conceptSourcesForDiagnosisSearch**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L28)

___

### consultEncounterType

• `Optional` **consultEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L29)

___

### consultFreeTextCommentsConcept

• `Optional` **consultFreeTextCommentsConcept**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L30)

___

### denyAdmissionConcept

• `Optional` **denyAdmissionConcept**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L31)

___

### diagnosisMetadata

• `Optional` **diagnosisMetadata**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L32)

___

### diagnosisSets

• `Optional` **diagnosisSets**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L33)

___

### dischargeForm

• `Optional` **dischargeForm**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L34)

___

### dispositionDescriptor

• `Optional` **dispositionDescriptor**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `admissionLocationConcept?` | `OpenmrsResource` |
| `dateOfDeathConcept?` | `OpenmrsResource` |
| `dispositionConcept?` | `OpenmrsResource` |
| `dispositionSetConcept?` | `OpenmrsResource` |
| `internalTransferLocationConcept?` | `OpenmrsResource` |

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L35)

___

### dispositions

• `Optional` **dispositions**: { `actions?`: [] ; `additionalObs?`: ``null`` ; `careSettingTypes?`: [``"OUTPATIENT"``] ; `conceptCode?`: `string` ; `encounterTypes?`: ``null`` ; `excludedEncounterTypes?`: `string`[] ; `keepsVisitOpen?`: ``null`` ; `name?`: `string` ; `type?`: `DispositionType` ; `uuid?`: `string`  }[]

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L42)

___

### emrApiConceptSource

• `Optional` **emrApiConceptSource**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:54](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L54)

___

### exitFromInpatientEncounterType

• `Optional` **exitFromInpatientEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L55)

___

### extraPatientIdentifierTypes

• `Optional` **extraPatientIdentifierTypes**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:56](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L56)

___

### fullPrivilegeLevel

• `Optional` **fullPrivilegeLevel**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L57)

___

### highPrivilegeLevel

• `Optional` **highPrivilegeLevel**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:58](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L58)

___

### identifierTypesToSearch

• `Optional` **identifierTypesToSearch**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L59)

___

### inpatientNoteEncounterType

• `Optional` **inpatientNoteEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L60)

___

### lastViewedPatientSizeLimit

• `Optional` **lastViewedPatientSizeLimit**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:61](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L61)

___

### metadataSourceName

• `Optional` **metadataSourceName**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L62)

___

### motherChildRelationshipType

• `Optional` **motherChildRelationshipType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L63)

___

### narrowerThanConceptMapType

• `Optional` **narrowerThanConceptMapType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:64](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L64)

___

### nonDiagnosisConceptSets

• `Optional` **nonDiagnosisConceptSets**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:65](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L65)

___

### orderingProviderEncounterRole

• `Optional` **orderingProviderEncounterRole**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:66](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L66)

___

### patientDiedConcept

• `Optional` **patientDiedConcept**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:67](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L67)

___

### personImageDirectory

• `Optional` **personImageDirectory**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:68](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L68)

___

### primaryIdentifierType

• `Optional` **primaryIdentifierType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:69](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L69)

___

### sameAsConceptMapType

• `Optional` **sameAsConceptMapType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:70](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L70)

___

### supportsAdmissionLocationTag

• `Optional` **supportsAdmissionLocationTag**: `LocationTag`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:72](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L72)

___

### supportsLoginLocationTag

• `Optional` **supportsLoginLocationTag**: `LocationTag`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:73](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L73)

___

### supportsTransferLocationTag

• `Optional` **supportsTransferLocationTag**: `LocationTag`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:74](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L74)

___

### supportsVisitsLocationTag

• `Optional` **supportsVisitsLocationTag**: `LocationTag`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L75)

___

### suppressedDiagnosisConcepts

• `Optional` **suppressedDiagnosisConcepts**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L71)

___

### telephoneAttributeType

• `Optional` **telephoneAttributeType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:76](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L76)

___

### testPatientPersonAttributeType

• `Optional` **testPatientPersonAttributeType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:77](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L77)

___

### transferForm

• `Optional` **transferForm**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L78)

___

### transferRequestEncounterType

• `Optional` **transferRequestEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:79](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L79)

___

### transferWithinHospitalEncounterType

• `Optional` **transferWithinHospitalEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:80](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L80)

___

### unknownCauseOfDeathConcept

• `Optional` **unknownCauseOfDeathConcept**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L81)

___

### unknownLocation

• `Optional` **unknownLocation**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:82](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L82)

___

### unknownPatientPersonAttributeType

• `Optional` **unknownPatientPersonAttributeType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:83](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L83)

___

### unknownProvider

• `Optional` **unknownProvider**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L84)

___

### visitAssignmentHandlerAdjustEncounterTimeOfDayIfNecessary

• `Optional` **visitAssignmentHandlerAdjustEncounterTimeOfDayIfNecessary**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L85)

___

### visitExpireHours

• `Optional` **visitExpireHours**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:86](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L86)

___

### visitNoteEncounterType

• `Optional` **visitNoteEncounterType**: `OpenmrsResource`

#### Defined in

[packages/framework/esm-react-utils/src/useEmrConfiguration.ts:87](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useEmrConfiguration.ts#L87)
