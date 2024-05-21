export const nameWithFormat = {
  id: 'efdb246f-4142-4c12-a27a-9be60b9592e9',
  family: 'Wilson',
  given: ['John'],
  text: 'Wilson, John',
};

export const nameWithoutFormat = {
  id: 'efdb246f-4142-4c12-a27a-9be60b9592e9',
  family: 'family name',
  given: ['given', 'middle'],
};

export const familyNameOnly = {
  id: 'efdb246f-4142-4c12-a27a-9be60b9592e9',
  family: 'family name',
};

export const givenNameOnly = {
  id: 'efdb246f-4142-4c12-a27a-9be60b9592e9',
  given: ['given'],
};

export const mockPatient = {
  resourceType: 'Patient',
  id: '8673ee4f-e2ab-4077-ba55-4980f408773e',
  extension: [
    {
      url: 'http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created',
      valueDateTime: '2017-01-18T09:42:40+00:00',
    },
    {
      url: 'https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1',
      valueString: 'daemon',
    },
  ],
  identifier: [
    {
      id: '1f0ad7a1-430f-4397-b571-59ea654a52db',
      use: 'secondary',
      system: 'Old Identification Number',
      value: '100732HE',
    },
    {
      id: '1f0ad7a1-430f-4397-b571-59ea654a52db',
      use: 'usual',
      system: 'OpenMRS ID',
      value: '100GEJ',
    },
  ],
  active: true,
  name: [nameWithFormat],
  gender: 'male',
  birthDate: '1972-04-04',
  deceasedBoolean: false,
  address: [],
};

export const mockPatientWithNoName = {
  ...mockPatient,
  name: [],
};

export const mockPatientWithMultipleNames = {
  // name usage may be: usual | official | temp | nickname | anonymous | old | maiden
  ...mockPatient,
  name: [
    {
      id: 'id-of-nickname-1',
      use: 'nickname',
      given: ['nick', 'name'],
    },
    {
      id: 'id-of-nickname-2',
      use: 'nickname',
      given: ['nick', 'name'],
    },
    {
      id: 'id-of-anonymous-name-1',
      use: 'anonymous',
      given: ['john', 'doe'],
    },
    {
      id: 'id-of-old-name-1',
      use: 'old',
      given: ['previous'],
      family: 'name',
    },
    {
      id: 'id-of-maiden-name-1',
      use: 'maiden',
      family: 'maiden name',
    },
    {
      // this is the actual display name
      id: 'id-of-usual-name-1',
      given: ['John', 'Murray'],
      family: 'Smith',
      text: 'Smith, John Murray',
    },
    {
      // this is usable as a display name, but the usual name will take precedence.
      id: 'id-of-official-name-1',
      use: 'official',
      given: ['my', 'official'],
      family: 'name',
    },
  ],
};

export const mockPatientWithOfficialName = {
  ...mockPatient,
  name: [
    {
      // this is usable as a display name, but the usual name should be preferred
      id: 'id-of-official-name-1',
      use: 'official',
      given: ['my', 'official'],
      family: 'name',
    },
    {
      // this is the preferred display name, even though it comes after the official name
      id: 'id-of-usual-name-1',
      use: 'usual', // explicitly marked as usual name
      given: ['my', 'actual'],
      family: 'name',
    },
  ],
};

export const mockPatientWithNickAndOfficialName = {
  ...mockPatient,
  name: [
    {
      id: 'id-of-nickname-1',
      use: 'nickname',
      given: ['nick', 'name'],
    },
    {
      id: 'id-of-official-name-1',
      use: 'official',
      given: ['my', 'official'],
      family: 'name',
    },
  ],
};
