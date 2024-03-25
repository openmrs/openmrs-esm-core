export const validLocationResponse = {
  ok: true,
  data: {
    resourceType: 'Bundle',
    id: 'e3c2aa40-21b0-4671-a492-bb7e7f16cc46',
    meta: {
      lastUpdated: '2023-11-08T08:45:48.967+00:00',
    },
    type: 'searchset',
    total: 1,
    link: [
      {
        relation: 'self',
        url: 'https://dev3.openmrs.org/openmrs/ws/fhir2/R4/Location?_id=1ce1b7d4-c865-4178-82b0-5932e51503d6',
      },
    ],
    entry: [
      {
        fullUrl: 'https://dev3.openmrs.org/openmrs/ws/fhir2/R4/Location/1ce1b7d4-c865-4178-82b0-5932e51503d6',
        resource: {
          resourceType: 'Location',
          id: '1ce1b7d4-c865-4178-82b0-5932e51503d6',
          meta: {
            lastUpdated: '2023-09-05T15:20:51.000+00:00',
            tag: [
              {
                system: 'http://fhir.openmrs.org/ext/location-tag',
                code: 'Login Location',
                display: 'When a user logs in and chooses a session location, they may only choose one with this tag',
              },
            ],
          },
          text: {
            status: 'generated',
            div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Community Outreach</h2></div>',
          },
          status: 'active',
          name: 'Community Outreach',
          description: 'Community Outreach',
        },
      },
    ],
  },
};

export const emptyLocationResponse = {
  ok: true,
  data: {
    resourceType: 'Bundle',
    id: 'e3c2aa40-21b0-4671-a492-bb7e7f16cc46',
    meta: {
      lastUpdated: '2023-11-08T08:45:48.967+00:00',
    },
    type: 'searchset',
    total: 0,
    link: [
      {
        relation: 'self',
        url: 'https://dev3.openmrs.org/openmrs/ws/fhir2/R4/Location?_id=1ce1b7d4-c865-4178-82b0-5932e51503d6',
      },
    ],
    entry: [],
  },
};

export const validatingLocationFailureResponse = {
  ok: true,
  data: {
    resourceType: 'Bundle',
    id: 'deaa418b-c900-4fd3-bb35-16fe5c2be744',
    meta: {
      lastUpdated: '2023-11-08T08:45:20.012+00:00',
    },
    type: 'searchset',
    total: 0,
    link: [
      {
        relation: 'self',
        url: 'https://dev3.openmrs.org/openmrs/ws/fhir2/R4/Location?_id=8d6c993e-c2cc-11de-8d13-0010c6dffd0',
      },
    ],
  },
};
