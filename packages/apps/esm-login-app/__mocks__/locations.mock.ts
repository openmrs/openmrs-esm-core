export const mockLoginLocations = {
  data: {
    resourceType: 'Bundle',
    id: '301b3ad6-868a-48a6-bc3f-aaa8aa3f89a6',
    meta: {
      lastUpdated: '2022-03-17T07:47:02.272+00:00',
      tag: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
          code: 'SUBSETTED',
          display: 'Resource encoded in summary mode',
        },
      ],
    },
    type: 'searchset',
    total: 4,
    link: [
      {
        relation: 'self',
        url: 'http://openmrs:8080/openmrs/ws/fhir2/R4/Location?_count=50&_summary=data&_tag=login%20location',
      },
    ],
    entry: [
      {
        fullUrl: 'http://openmrs:8080/openmrs/ws/fhir2/R4/Location/44c3efb0-2583-4c80-a79e-1f756a03c0a1',
        resource: {
          resourceType: 'Location',
          id: '44c3efb0-2583-4c80-a79e-1f756a03c0a1',
          meta: {
            tag: [
              {
                system: 'http://fhir.openmrs.org/ext/location-tag',
                code: 'Login Location',
                display: 'When a user logs in and chooses a session location, they may only choose one with this tag',
              },
              {
                system: 'http://fhir.openmrs.org/ext/location-tag',
                code: 'Facility Location',
              },
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                code: 'SUBSETTED',
                display: 'Resource encoded in summary mode',
              },
            ],
          },
          contained: [
            {
              resourceType: 'Provenance',
              id: 'e6f5d190-5a5a-4e1f-b34b-20a3480a6e1b',
              meta: {
                tag: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                    code: 'SUBSETTED',
                    display: 'Resource encoded in summary mode',
                  },
                ],
              },
              recorded: '2022-02-23T22:44:33.000+00:00',
              activity: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystemv3-DataOperation',
                    code: 'CREATE',
                    display: 'create',
                  },
                ],
              },
              agent: [
                {
                  type: {
                    coding: [
                      {
                        system: 'http://terminology.hl7.org/CodeSystemprovenance-participant-type',
                        code: 'author',
                        display: 'Author',
                      },
                    ],
                  },
                  role: [
                    {
                      coding: [
                        {
                          system: 'http://terminology.hl7.org/CodeSystemv3-ParticipationType',
                          code: 'AUT',
                          display: 'author',
                        },
                      ],
                    },
                  ],
                  who: {
                    reference: 'Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
                    type: 'Practitioner',
                    display: 'Super User',
                  },
                },
              ],
            },
          ],
          status: 'active',
          name: 'Outpatient Clinic',
          description: 'Outpatient Clinic',
        },
      },
      {
        fullUrl: 'http://openmrs:8080/openmrs/ws/fhir2/R4/Location/ba685651-ed3b-4e63-9b35-78893060758a',
        resource: {
          resourceType: 'Location',
          id: 'ba685651-ed3b-4e63-9b35-78893060758a',
          meta: {
            tag: [
              {
                system: 'http://fhir.openmrs.org/ext/location-tag',
                code: 'Login Location',
                display: 'When a user logs in and chooses a session location, they may only choose one with this tag',
              },
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                code: 'SUBSETTED',
                display: 'Resource encoded in summary mode',
              },
            ],
          },
          contained: [
            {
              resourceType: 'Provenance',
              id: '621310a4-4c42-46eb-83e8-46e4a61cf250',
              meta: {
                tag: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                    code: 'SUBSETTED',
                    display: 'Resource encoded in summary mode',
                  },
                ],
              },
              recorded: '2022-02-23T22:44:33.000+00:00',
              activity: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystemv3-DataOperation',
                    code: 'CREATE',
                    display: 'create',
                  },
                ],
              },
              agent: [
                {
                  type: {
                    coding: [
                      {
                        system: 'http://terminology.hl7.org/CodeSystemprovenance-participant-type',
                        code: 'author',
                        display: 'Author',
                      },
                    ],
                  },
                  role: [
                    {
                      coding: [
                        {
                          system: 'http://terminology.hl7.org/CodeSystemv3-ParticipationType',
                          code: 'AUT',
                          display: 'author',
                        },
                      ],
                    },
                  ],
                  who: {
                    reference: 'Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
                    type: 'Practitioner',
                    display: 'Super User',
                  },
                },
              ],
            },
          ],
          status: 'active',
          name: 'Inpatient Ward',
          description: 'Inpatient Ward',
        },
      },
      {
        fullUrl: 'http://openmrs:8080/openmrs/ws/fhir2/R4/Location/8d9045ad-50f0-45b8-93c8-3ed4bce19dbf',
        resource: {
          resourceType: 'Location',
          id: '8d9045ad-50f0-45b8-93c8-3ed4bce19dbf',
          meta: {
            tag: [
              {
                system: 'http://fhir.openmrs.org/ext/location-tag',
                code: 'Login Location',
                display: 'When a user logs in and chooses a session location, they may only choose one with this tag',
              },
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                code: 'SUBSETTED',
                display: 'Resource encoded in summary mode',
              },
            ],
          },
          contained: [
            {
              resourceType: 'Provenance',
              id: '307f2319-cf8a-419d-9c0d-94fbe385e214',
              meta: {
                tag: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                    code: 'SUBSETTED',
                    display: 'Resource encoded in summary mode',
                  },
                ],
              },
              recorded: '2022-02-23T22:44:33.000+00:00',
              activity: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystemv3-DataOperation',
                    code: 'CREATE',
                    display: 'create',
                  },
                ],
              },
              agent: [
                {
                  type: {
                    coding: [
                      {
                        system: 'http://terminology.hl7.org/CodeSystemprovenance-participant-type',
                        code: 'author',
                        display: 'Author',
                      },
                    ],
                  },
                  role: [
                    {
                      coding: [
                        {
                          system: 'http://terminology.hl7.org/CodeSystemv3-ParticipationType',
                          code: 'AUT',
                          display: 'author',
                        },
                      ],
                    },
                  ],
                  who: {
                    reference: 'Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
                    type: 'Practitioner',
                    display: 'Super User',
                  },
                },
              ],
            },
          ],
          status: 'active',
          name: 'Mobile Clinic',
          description: 'Mobile Clinic',
        },
      },
      {
        fullUrl: 'http://openmrs:8080/openmrs/ws/fhir2/R4/Location/1ce1b7d4-c865-4178-82b0-5932e51503d6',
        resource: {
          resourceType: 'Location',
          id: '1ce1b7d4-c865-4178-82b0-5932e51503d6',
          meta: {
            tag: [
              {
                system: 'http://fhir.openmrs.org/ext/location-tag',
                code: 'Login Location',
                display: 'When a user logs in and chooses a session location, they may only choose one with this tag',
              },
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                code: 'SUBSETTED',
                display: 'Resource encoded in summary mode',
              },
            ],
          },
          contained: [
            {
              resourceType: 'Provenance',
              id: 'd82a66d0-2c79-4679-8330-dac32aa1209c',
              meta: {
                tag: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                    code: 'SUBSETTED',
                    display: 'Resource encoded in summary mode',
                  },
                ],
              },
              recorded: '2022-02-23T22:44:33.000+00:00',
              activity: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystemv3-DataOperation',
                    code: 'CREATE',
                    display: 'create',
                  },
                ],
              },
              agent: [
                {
                  type: {
                    coding: [
                      {
                        system: 'http://terminology.hl7.org/CodeSystemprovenance-participant-type',
                        code: 'author',
                        display: 'Author',
                      },
                    ],
                  },
                  role: [
                    {
                      coding: [
                        {
                          system: 'http://terminology.hl7.org/CodeSystemv3-ParticipationType',
                          code: 'AUT',
                          display: 'author',
                        },
                      ],
                    },
                  ],
                  who: {
                    reference: 'Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
                    type: 'Practitioner',
                    display: 'Super User',
                  },
                },
              ],
            },
          ],
          status: 'active',
          name: 'Community Outreach',
          description: 'Community Outreach',
        },
      },
    ],
  },
};

export const mockLocationResponseWithOneEntry = {
  data: {
    resourceType: 'Bundle',
    id: '301b3ad6-868a-48a6-bc3f-aaa8aa3f89a6',
    meta: {
      lastUpdated: '2022-03-17T07:47:02.272+00:00',
      tag: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
          code: 'SUBSETTED',
          display: 'Resource encoded in summary mode',
        },
      ],
    },
    type: 'searchset',
    total: 1,
    link: [
      {
        relation: 'self',
        url: 'http://openmrs:8080/openmrs/ws/fhir2/R4/Location?_count=50&_summary=data&_tag=login%20location',
      },
    ],
    entry: [
      {
        fullUrl: 'http://openmrs:8080/openmrs/ws/fhir2/R4/Location/44c3efb0-2583-4c80-a79e-1f756a03c0a1',
        resource: {
          resourceType: 'Location',
          id: '44c3efb0-2583-4c80-a79e-1f756a03c0a1',
          meta: {
            tag: [
              {
                system: 'http://fhir.openmrs.org/ext/location-tag',
                code: 'Login Location',
                display: 'When a user logs in and chooses a session location, they may only choose one with this tag',
              },
              {
                system: 'http://fhir.openmrs.org/ext/location-tag',
                code: 'Facility Location',
              },
              {
                system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                code: 'SUBSETTED',
                display: 'Resource encoded in summary mode',
              },
            ],
          },
          contained: [
            {
              resourceType: 'Provenance',
              id: 'e6f5d190-5a5a-4e1f-b34b-20a3480a6e1b',
              meta: {
                tag: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
                    code: 'SUBSETTED',
                    display: 'Resource encoded in summary mode',
                  },
                ],
              },
              recorded: '2022-02-23T22:44:33.000+00:00',
              activity: {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystemv3-DataOperation',
                    code: 'CREATE',
                    display: 'create',
                  },
                ],
              },
              agent: [
                {
                  type: {
                    coding: [
                      {
                        system: 'http://terminology.hl7.org/CodeSystemprovenance-participant-type',
                        code: 'author',
                        display: 'Author',
                      },
                    ],
                  },
                  role: [
                    {
                      coding: [
                        {
                          system: 'http://terminology.hl7.org/CodeSystemv3-ParticipationType',
                          code: 'AUT',
                          display: 'author',
                        },
                      ],
                    },
                  ],
                  who: {
                    reference: 'Practitioner/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
                    type: 'Practitioner',
                    display: 'Super User',
                  },
                },
              ],
            },
          ],
          status: 'active',
          name: 'Outpatient Clinic',
          description: 'Outpatient Clinic',
        },
      },
    ],
  },
};

export const validatingLocationSuccessResponse = {
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

export const validatingLocationFailureResponse = {
  ok: false,
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

export const mockSoleLoginLocation = {
  data: {
    id: '301b3ad6-868a-48a6-bc3f-aaa8aa3f891z',
    total: 1,
    link: [
      {
        relation: 'self',
        url: 'http://openmrs:8080/openmrs/ws/fhir2/R4/Location?_count=50&_summary=data&_tag=login%20location',
      },
    ],
    entry: [
      {
        resource: {
          id: '44c3efb0-2583-4c80-a79e-1f756a03c0a1',
          status: 'active',
          name: 'Outpatient Clinic',
          description: 'Outpatient Clinic',
        },
      },
    ],
  },
};

export const mockSetSessionLocation = Promise.resolve();
