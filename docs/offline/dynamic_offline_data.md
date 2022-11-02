# Dynamic Offline Data

In order to support offline usage of the application, OpenMRS must precache specific resources.
In general, we can differentiate between two offline resource categories:

1. Static resources
2. Dynamic resources

An example of *static resources* are compiled artifacts like HTML files, compiled JS files or
images provided by the app shell or arbitrary microfrontend modules. During a user session,
*static resources* don't change - they are always known and can automatically be precached
by the application.

*Dynamic resources*, on the other hand, depend on choices the user actively makes during a session.
Take, for example, offline patients. Automatically precaching every single patient is not possible
due to the sheer size of data that would have to be stored on a device. To solve this issue,
OpenMRS provides the concept of the *offline patient list* in the offline tools UI. This offline
patient list is a screen that allows a user to actively select and deselect the patients to
be taken offline. Upon selection, each microfrontend module must ensure that it precaches all
patient-related resources that it requires for an offline session.

The above paragraph only mentioned offline *patient* lists. The concept of an "offline list" exists
for multiple resources though, e.g. for the aforementioned patients, but also offline forms.
In theory, it is possible to maintain dynamic offline lists of any kind of resource.
The OpenMRS `esm-framework` provides a shared API for managing those arbitrary offline lists
and synchronizing the data of the resources tracked on each list. This API is called the
"Dynamic Offline Data API".

In the following, the concepts and members of the dynamic offline data API are explained.


## Dynamic Offline Data Overview

From a high-level perspective, the dynamic offline data API needs to address two concerns:

1. Offline list maintenance: Adding/removing/updating items on an offline list of a
   specific *resource type*.
2. Offline list synchronization: Enable microfrontend modules to precache the data of a resource on
   an offline list.

These two cornerstones enable the offline data management flow shown in the following diagram,
using the example of making a patient offline-ready:

![Dynamic Offline Data Flow](./dynamic_offline_data_flow.png)

As shown in the image above, the raw "lists" are simply stored in a client-side database table.
These table entries only contain the information required for synchronizing a resource, i.e.
its `type` (to distinguish between different resources, e.g. `patient` vs. `form`) and an
`identifier` (which is typically the UUID of the resource).
With this information available, each microfrontend module can register a *synchronization
handler* function which, when invoked, receives the information from the table and can, by using
that information, make any API calls necessary for fetching and precaching the exact data
that this specific microfrontend module needs for working with that patient in offline mode.
One microfrontend module might, for example, need to precache the entire patient resource while
another one might only require a slimmed-down version that only contains the patient's name.


## Managing Dynamic Offline Data ("Resource Lists")

This section describes the API that is provided by `esm-framework` for managing dynamic offline
data lists. This section can only provide an overview. For additional details, see the corresponding
API documentation.

The following code fragment shows how the API can be used to manage the offline patient list:

```ts
// In order to manage a list, we require a `type`.
// The type is a convention. Different microfrontend modules must agree on the same type
// in order to access the same lists.
// OpenMRS uses the `patient` type for managing the "Patient" resource.
const patientListType = 'patient';

// Adding patients to the list is simple:
// We can call `putDynamicOfflineData` which adds the patient with the given identifier/UUID
// to the offline patient list.
// If a patient already exists on the list, nothing happens (hence the `put`).
const patientUuid = '00000000-0000-0000-0000-000000000001';
await putDynamicOfflineData(patientListType, patientUuid);

// In order to synchronize the data of that patient, we can use `syncDynamicOfflineData`.
// This only synchronizes this specific patient. Other patients on the list are *not* synced.
await syncDynamicOfflineData(patientListType, patientUuid);

// It is also possible to sync *all* entries on a given list at the same time:
await syncAllDynamicOfflineData(patientListType);

// If we want to remove the patient, we can do so with `removeDynamicOfflineData`.
await removeDynamicOfflineData(patientListType, patientUuid);
```

It is also possible to retrieve all entries on a list. This is, for example, required for
displaying the patients who are currently marked as offline patients in a table.

```ts
// getDynamicOfflineDataEntries can be used to either retrieve all entries or only those of a given type.
const allEntries = await getDynamicOfflineDataEntries();
const allOfflinePatientEntries = await getDynamicOfflineDataEntries('patient');

for (const entry of allEntries) {
  console.log(
    'Entry information (not necessarily complete):',
    entry.type,
    entry.identifier,
    entry.users,
    entry.syncState,
  );
}
```


## Dynamic Offline Data Synchronization

The previous section showed how dynamic offline data lists are managed and how synchronization
can be triggered. In this section, the second cornerstone, data synchronization, is shown.

The core idea of synchronization is that each individual microfrontend module might need to
precache different data for the same resource. At the example of the offline patient, it could
happen that the following microfrontend modules might need to precache the following, different
datasets:

* **MF 1:** The entire patient resource.
* **MF 2:** A slimmed-down patient resource, only containing the patient's name.
* **MF 3:** Nothing at all.

Therefore, each module must be allowed to provide its own synchronization logic.
This is centrally enabled by the dynamic offline data API via so-called "synchronization handlers"
(a.k.a. `DynamicOfflineDataHandler`).
A synchronization handler is a simple object providing, at minimum:

1. A unique ID.
2. Information about which resource `type` it can synchronize.
3. A function `sync` that does the actual precaching/synchronization logic.
4. A function `isSynced` which evaluates whether all required data is precached
   *at this very moment*.

The following code fragment shows how a handler for precaching patient data can be setup:

```ts
setupDynamicOfflineDataHandler({
  id: 'my-microfrontend-module:patient-handler',
  type: 'patient',

  // Optional.
  get displayName() {
    return i18n('My microfrontend offline patient handler');
  },

  async isSynced(identifier: string, abortSignal?: AbortSignal) {
    return await isUrlInCache(`/ws/rest/v1/patient/${identifier}`, abortSignal);
  },

  async sync(identifier: string, abortSignal?: AbortSignal) {
    return await precacheUrl(`/ws/rest/v1/patient/${identifier}`, abortSignal);
  },
})
```

Once registered, the handler is automatically invoked when a `patient` is synchronized via
one of the synchronization functions described in the previous section.

It is also possible for any microfrontend module to retrieve (and directly use) all currently
registered handlers. This may, for example, be useful for determining which data is currently
synchronized:

```ts
const allHandlers = getDynamicOfflineDataHandlers();
const patientHandlers = allHandlers.filter(x => x.type === 'patient');

for (const patientHandler of patientHandlers) {
  console.log(
    'Is a patient synchronized?',
    await patientHandler.isSynced('00000000-0000-0000-0000-000000000001')
  );
}
```


## User-Specific Dynamic Offline Data Entries

OpenMRS, naturally, supports multiple users. If multiple users use the same device, it is possible
for both users to have different offline lists (for example because they require different patients
in offline mode).
By default, the functions described above automatically use the logged-in user. For example,
`putDynamicOfflineData` automatically stores the UUID of the currently logged-in user in
the entry that is created in the table.

Despite this, it is also possible to actively declare the user for which an entry should be managed.
By convention, functions which allow specifying a user have the `For` suffix.
`putDynamicOfflineData(type, identifier)` becomes `putDynamicOfflineDataFor(userId, type, identifier)`.
For additional details, see the corresponding API documentation or the codebase itself.
