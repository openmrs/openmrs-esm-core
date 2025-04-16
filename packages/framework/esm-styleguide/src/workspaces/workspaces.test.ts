import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearMockExtensionRegistry } from '@openmrs/esm-framework/mock';
import { registerExtension, registerWorkspace, registerWorkspaceGroup } from '@openmrs/esm-extensions';
import {
  type Prompt,
  cancelPrompt,
  closeWorkspace,
  getWorkspaceGroupStore,
  getWorkspaceStore,
  launchWorkspace,
  launchWorkspaceGroup,
  resetWorkspaceStore,
} from './workspaces';

describe('workspace system', () => {
  beforeEach(() => {
    resetWorkspaceStore();
    clearMockExtensionRegistry();
  });

  it('registering, launching, and closing a workspace', () => {
    const store = getWorkspaceStore();
    registerWorkspace({ name: 'allergies', title: 'Allergies', load: vi.fn(), moduleName: '@openmrs/foo' });

    launchWorkspace('allergies', { foo: true });

    expect(store.getState().openWorkspaces.length).toEqual(1);

    const allergies = store.getState().openWorkspaces[0];
    expect(allergies.name).toBe('allergies');
    expect(allergies.additionalProps['foo']).toBe(true);

    allergies.closeWorkspace();

    expect(store.getState().openWorkspaces.length).toEqual(0);
  });

  describe('Testing launchPatientWorkspace', () => {
    it('should launch a workspace', () => {
      const store = getWorkspaceStore();
      registerWorkspace({ name: 'allergies', title: 'Allergies', load: vi.fn(), moduleName: '@openmrs/foo' });

      launchWorkspace('allergies', { foo: true });

      expect(store.getState().openWorkspaces.length).toEqual(1);

      const allergies = store.getState().openWorkspaces[0];
      expect(allergies.name).toBe('allergies');
      expect(allergies.additionalProps['foo']).toBe(true);
    });

    it('should update additionalProps when re-opening an already opened form with same name but with different props', () => {
      const store = getWorkspaceStore();

      registerWorkspace({ name: 'POC HIV Form', title: 'Clinical Form', load: vi.fn(), moduleName: '@openmrs/foo' });
      launchWorkspace('POC HIV Form', { workspaceTitle: 'POC HIV Form' });

      expect(store.getState().openWorkspaces.length).toEqual(1);

      const POCHIVForm = store.getState().openWorkspaces[0];
      expect(POCHIVForm.name).toBe('POC HIV Form');
      expect(POCHIVForm.additionalProps['workspaceTitle']).toBe('POC HIV Form');

      launchWorkspace('POC HIV Form', { workspaceTitle: 'POC HIV Form Updated' });

      expect(POCHIVForm.additionalProps['workspaceTitle']).toBe('POC HIV Form Updated');
      expect(store.getState().openWorkspaces.length).toEqual(1);

      POCHIVForm.closeWorkspace();

      expect(store.getState().openWorkspaces.length).toEqual(0);
    });

    it('should show a modal when a workspace is already open (with changes) and it cannot hide', () => {
      const store = getWorkspaceStore();
      registerWorkspace({ name: 'allergies', title: 'Allergies', load: vi.fn(), moduleName: '@openmrs/foo' });

      launchWorkspace('allergies', { foo: true });

      expect(store.getState().openWorkspaces.length).toEqual(1);

      const allergies = store.getState().openWorkspaces?.[0];
      allergies.promptBeforeClosing(() => true);

      registerWorkspace({ name: 'conditions', title: 'Conditions', load: vi.fn(), moduleName: '@openmrs/foo' });
      launchWorkspace('conditions', { foo: true });

      const prompt = store.getState().prompt as Prompt;
      expect(prompt).toBeTruthy();
      expect(prompt.title).toMatch(/unsaved changes/i);
      expect(prompt.body).toMatch(
        'There may be unsaved changes in "Allergies". Please save them before opening another workspace.',
      );
      expect(prompt.confirmText).toMatch(/Open anyway/i);

      prompt.onConfirm();

      expect(store.getState().openWorkspaces.length).toEqual(1);

      const openedWorkspace = store.getState().openWorkspaces[0];
      expect(openedWorkspace.name).toBe('conditions');
      expect(openedWorkspace.name).not.toBe('Allergies');
    });

    it('should not show a modal and open the workspace when a workspace is already open and it can hide, both workspaces being of different type', () => {
      const store = getWorkspaceStore();
      registerWorkspace({
        name: 'allergies',
        title: 'Allergies',
        load: vi.fn(),
        canHide: true,
        type: 'allergies-form',
        moduleName: '@openmrs/foo',
      });

      launchWorkspace('allergies', { foo: true });

      expect(store.getState().openWorkspaces.length).toEqual(1);

      registerWorkspace({
        name: 'conditions',
        title: 'Conditions',
        load: vi.fn(),
        type: 'conditions-form',
        moduleName: '@openmrs/foo',
      });
      launchWorkspace('conditions', { foo: true });

      expect(store.getState().openWorkspaces.length).toEqual(2);

      const openedWorkspaces = store.getState().openWorkspaces;
      expect(openedWorkspaces[0].name).toBe('conditions');
      expect(openedWorkspaces[1].name).not.toBe('Allergies');
    });

    it("should show a modal when launching a workspace with type matching the already opened workspace's type and should show the previous opened workspace in front when showing the modal", () => {
      const store = getWorkspaceStore();

      registerWorkspace({
        name: 'allergies',
        title: 'Allergies',
        load: vi.fn(),
        canHide: true,
        type: 'form',
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'conditions',
        title: 'Conditions',
        load: vi.fn(),
        canHide: true,
        type: 'conditions-form',
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'vitals',
        title: 'Vitals form',
        load: vi.fn(),
        type: 'form',
        moduleName: '@openmrs/foo',
      });

      launchWorkspace('allergies');
      launchWorkspace('conditions');

      expect(store.getState().openWorkspaces.length).toEqual(2);
      expect(store.getState().openWorkspaces[0].name).toBe('conditions');
      expect(store.getState().openWorkspaces[1].name).toBe('allergies');

      const allergies = store.getState().openWorkspaces[1];
      allergies.promptBeforeClosing(() => true);

      launchWorkspace('vitals');

      expect(store.getState().openWorkspaces.length).toEqual(2);
      expect(store.getState().openWorkspaces[0].name).toBe('allergies');
      expect(store.getState().openWorkspaces[1].name).toBe('conditions');

      const prompt = store.getState().prompt as Prompt;
      expect(prompt).toBeTruthy();
      expect(prompt.title).toMatch(/unsaved changes/i);
      expect(prompt.body).toMatch(
        'There may be unsaved changes in "Allergies". Please save them before opening another workspace.',
      );
      expect(prompt.confirmText).toMatch(/Open anyway/i);

      prompt.onConfirm();

      expect(store.getState().openWorkspaces.length).toEqual(2);
      expect(store.getState().openWorkspaces[0].name).toBe('vitals');
      expect(store.getState().openWorkspaces[1].name).toBe('conditions');
    });

    it("should not show a modal when launching a workspace with type not matching with any already opened workspace's type", () => {
      const store = getWorkspaceStore();

      registerWorkspace({
        name: 'allergies',
        title: 'Allergies',
        load: vi.fn(),
        canHide: true,
        type: 'allergies-form',
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'conditions',
        title: 'Conditions',
        load: vi.fn(),
        canHide: true,
        type: 'conditions-form',
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'vitals',
        title: 'Vitals form',
        load: vi.fn(),
        type: 'vitals-form',
        moduleName: '@openmrs/foo',
      });

      launchWorkspace('allergies');
      launchWorkspace('conditions');

      expect(store.getState().openWorkspaces.length).toEqual(2);
      expect(store.getState().openWorkspaces[0].name).toBe('conditions');
      expect(store.getState().openWorkspaces[1].name).toBe('allergies');

      launchWorkspace('vitals');

      expect(store.getState().openWorkspaces.length).toEqual(3);
      expect(store.getState().openWorkspaces[0].name).toBe('vitals');
      expect(store.getState().openWorkspaces[1].name).toBe('conditions');
      expect(store.getState().openWorkspaces[2].name).toBe('allergies');

      const prompt = store.getState().prompt;
      expect(prompt).toBeFalsy();
    });

    it('should show 2 modals if both, workspace with `canHide=false` and workspace type matches with already opened workspace', () => {
      const store = getWorkspaceStore();
      registerWorkspace({
        name: 'allergies',
        title: 'Allergies',
        load: vi.fn(),
        canHide: true,
        type: 'form',
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'attachments',
        title: 'Attachements',
        load: vi.fn(),
        canHide: true,
        type: 'attachments-form',
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'conditions',
        title: 'Conditions',
        load: vi.fn(),
        type: 'conditions-form',
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'vitals',
        title: 'Vitals form',
        load: vi.fn(),
        type: 'form',
        moduleName: '@openmrs/foo',
      });

      launchWorkspace('allergies');
      launchWorkspace('attachments');
      launchWorkspace('conditions');

      expect(store.getState().openWorkspaces.length).toEqual(3);
      expect(store.getState().openWorkspaces.map((w) => w.name)).toEqual(['conditions', 'attachments', 'allergies']);

      const conditionsWorkspace = store.getState().openWorkspaces?.[0];
      const allergiesWorkspace = store.getState().openWorkspaces?.[2];
      conditionsWorkspace.promptBeforeClosing(() => true);
      allergiesWorkspace.promptBeforeClosing(() => true);
      launchWorkspace('vitals');

      expect(store.getState().openWorkspaces.length).toEqual(3);
      expect(store.getState().openWorkspaces[0].name).toBe('conditions');

      const prompt = store.getState().prompt as Prompt;
      expect(prompt).toBeTruthy();
      expect(prompt.body).toMatch(
        'There may be unsaved changes in "Conditions". Please save them before opening another workspace.',
      );
      // Closing the conditions workspace because it cannot be hidden

      prompt.onConfirm();

      expect(store.getState().openWorkspaces.length).toEqual(2);
      // Bringing the `allergies` workspace in front because it matches the vitals workspace type
      expect(store.getState().openWorkspaces[0].name).toEqual('allergies');

      const prompt2 = store.getState().prompt as Prompt;

      expect(prompt2).toBeTruthy();
      expect(prompt2.body).toMatch(
        'There may be unsaved changes in "Allergies". Please save them before opening another workspace.',
      );

      prompt2.onConfirm();

      expect(store.getState().openWorkspaces.length).toEqual(2);
      expect(store.getState().openWorkspaces[0].name).toBe('vitals');
      expect(store.getState().openWorkspaces[1].name).toBe('attachments');
    });

    it("should launch workspace in workspace's preferredSize", () => {
      const store = getWorkspaceStore();
      registerWorkspace({
        name: 'allergies',
        title: 'Allergies',
        load: vi.fn(),
        canHide: true,
        type: 'form',
        preferredWindowSize: 'maximized',
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'attachments',
        title: 'Attachements',
        load: vi.fn(),
        canHide: true,
        type: 'attachments-form',
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'conditions',
        title: 'Conditions',
        load: vi.fn(),
        type: 'conditions-form',
        preferredWindowSize: 'maximized',
        moduleName: '@openmrs/foo',
      });

      launchWorkspace('allergies');

      expect(store.getState().openWorkspaces.length).toBe(1);
      expect(store.getState().workspaceWindowState).toBe('maximized');

      launchWorkspace('attachments');

      expect(store.getState().openWorkspaces.length).toBe(2);
      expect(store.getState().workspaceWindowState).toBe('normal');

      launchWorkspace('conditions');

      expect(store.getState().openWorkspaces.length).toBe(3);
      expect(store.getState().workspaceWindowState).toBe('maximized');

      store.getState().openWorkspaces[0].closeWorkspace({ ignoreChanges: true });
      expect(store.getState().workspaceWindowState).toBe('normal');

      store.getState().openWorkspaces[0].closeWorkspace();
      expect(store.getState().workspaceWindowState).toBe('maximized');

      store.getState().openWorkspaces[0].closeWorkspace({ ignoreChanges: true });
      expect(store.getState().workspaceWindowState).toBe('normal');
    });
  });

  it('coexisting and non-coexisting workspaces', () => {
    const store = getWorkspaceStore();
    // conditions and form-entry are of the same (default) type, so they will not coexist.
    // order-meds is of a different type, so it will open on top of the others.
    registerWorkspace({
      name: 'conditions',
      title: 'Conditions',
      load: vi.fn(),
      canHide: true,
      moduleName: '@openmrs/foo',
    });
    registerWorkspace({
      name: 'form-entry',
      title: 'Some Form',
      load: vi.fn(),
      canHide: true,
      moduleName: '@openmrs/foo',
    });
    registerWorkspace({
      name: 'order-meds',
      title: 'Order Medications',
      load: vi.fn(),
      canHide: true,
      type: 'order',
      moduleName: '@openmrs/foo',
    });

    // Test opening the same workspace twice--should be a no-op
    launchWorkspace('conditions');
    launchWorkspace('conditions');

    expect(store.getState().openWorkspaces.length).toEqual(1);

    const conditionsWorkspace = store.getState().openWorkspaces[0];
    conditionsWorkspace.promptBeforeClosing(() => true);

    // Test opening a workspace of the same type--should require confirmation and then replace
    launchWorkspace('form-entry', { foo: true });

    expect(store.getState().openWorkspaces.length).toEqual(1);
    expect(store.getState().openWorkspaces[0].name).toBe('conditions');

    let prompt = store.getState().prompt as Prompt;
    expect(prompt.title).toMatch(/unsaved changes/i);

    prompt.onConfirm();

    expect(store.getState().prompt).toBeNull();
    expect(store.getState().openWorkspaces.length).toEqual(1);
    expect(store.getState().openWorkspaces[0].name).toBe('form-entry');
    expect(store.getState().openWorkspaces[0].additionalProps['foo']).toBe(true);

    // Test opening a workspace of a different type--should open directly
    launchWorkspace('order-meds');

    expect(store.getState().openWorkspaces.length).toEqual(2);
    expect(store.getState().openWorkspaces[0].name).toBe('order-meds');
    expect(store.getState().openWorkspaces[1].name).toBe('form-entry');

    const formEntryWorkspace = store.getState().openWorkspaces[1];
    formEntryWorkspace.promptBeforeClosing(() => true);

    // Test going through confirmation flow while order-meds is open
    // Changing the form workspace shouldn't destroy the order-meds workspace
    launchWorkspace('conditions');

    expect(store.getState().openWorkspaces.length).toEqual(2);
    expect(store.getState().openWorkspaces[0].name).toBe('form-entry');
    expect(store.getState().openWorkspaces[1].name).toBe('order-meds');

    prompt = store.getState().prompt as Prompt;

    expect(prompt.title).toMatch(/unsaved changes/i);

    cancelPrompt(); // should leave same workspaces intact

    expect(store.getState().openWorkspaces.length).toEqual(2);
    expect(store.getState().openWorkspaces[0].name).toBe('form-entry');
    expect(store.getState().openWorkspaces[1].name).toBe('order-meds');
    expect(store.getState().prompt).toBeNull();

    launchWorkspace('conditions');

    prompt = store.getState().prompt as Prompt;
    prompt.onConfirm();

    expect(store.getState().openWorkspaces.length).toEqual(2);
    expect(store.getState().openWorkspaces[0].name).toBe('conditions');
    expect(store.getState().openWorkspaces[1].name).toBe('order-meds');

    store.getState().openWorkspaces[0].closeWorkspace({ ignoreChanges: true });

    expect(store.getState().openWorkspaces.length).toEqual(1);
    expect(store.getState().openWorkspaces[0].name).toBe('order-meds');
  });

  it('respects promptBeforeClosing function', () => {
    const store = getWorkspaceStore();
    registerWorkspace({ name: 'hiv', title: 'HIV', load: vi.fn(), moduleName: '@openmrs/foo' });
    registerWorkspace({ name: 'diabetes', title: 'Diabetes', load: vi.fn(), moduleName: '@openmrs/foo' });

    launchWorkspace('hiv');

    store.getState().openWorkspaces[0].promptBeforeClosing(() => false);

    launchWorkspace('diabetes');

    expect(store.getState().prompt).toBeNull();
    expect(store.getState().openWorkspaces[0].name).toBe('diabetes');

    store.getState().openWorkspaces[0].promptBeforeClosing(() => true);

    launchWorkspace('hiv');

    expect(store.getState().openWorkspaces[0].name).toBe('diabetes');

    const prompt = store.getState().prompt as Prompt;
    expect(prompt.title).toMatch(/unsaved changes/i);

    prompt.onConfirm();

    expect(store.getState().openWorkspaces[0].name).toBe('hiv');
  });

  it('is compatible with workspaces registered as extensions', () => {
    console.warn = vi.fn();
    const store = getWorkspaceStore();
    registerExtension({
      name: 'lab-results',
      moduleName: '@openmrs/esm-lab-results-app',
      load: vi.fn(),
      meta: { title: 'Lab Results', screenSize: 'maximized' },
    });

    launchWorkspace('lab-results', { foo: true });

    expect(store.getState().openWorkspaces.length).toEqual(1);

    const workspace = store.getState().openWorkspaces[0];
    expect(workspace.name).toEqual('lab-results');
    expect(workspace.additionalProps['foo']).toBe(true);
    expect(workspace.title).toBe('Lab Results');
    expect(workspace.preferredWindowSize).toBe('maximized');
    expect(console.warn).toHaveBeenCalled();
  });

  it('launching unregistered workspace throws an error', () => {
    expect(() => launchWorkspace('test-results')).toThrow(/test-results.*registered/i);
  });

  it('respects promptBeforeClosing function before closing workspace, with unsaved changes', () => {
    const store = getWorkspaceStore();
    registerWorkspace({ name: 'hiv', title: 'HIV', load: vi.fn(), moduleName: '@openmrs/foo' });

    launchWorkspace('hiv');

    store.getState().openWorkspaces[0].promptBeforeClosing(() => true);
    store.getState().openWorkspaces[0].closeWorkspace({ ignoreChanges: false });

    const prompt = store.getState().prompt as Prompt;
    expect(prompt.title).toMatch(/unsaved changes/i);
    expect(prompt.body).toBe(
      'You may have unsaved changes in the opened workspace. Do you want to discard these changes?',
    );
    expect(prompt.confirmText).toBe('Discard');

    prompt.onConfirm();

    expect(store.getState().prompt).toBeNull();
    expect(store.getState().openWorkspaces.length).toBe(0);
  });

  describe('Testing `getWorkspaceGroupStore` function', () => {
    it('should return undefined if no workspace sidebar name is passed', () => {
      let workspaceGroupStore = getWorkspaceGroupStore(undefined);

      expect(workspaceGroupStore).toBeUndefined();

      workspaceGroupStore = getWorkspaceGroupStore('default');
      expect(workspaceGroupStore).toBeUndefined();
    });

    it('should return store if workspace sidebar name is passed', () => {
      const workspaceGroupStore = getWorkspaceGroupStore('ward-patient-store', {
        foo: true,
      });

      expect(workspaceGroupStore).toBeTruthy();
      expect(workspaceGroupStore?.getState()['foo']).toBe(true);
    });

    it('should update the store state with new additionalProps if workspaces with same workspaceGroup name calls the function', () => {
      let workspaceGroupStore = getWorkspaceGroupStore('ward-patient-store', {
        foo: true,
      });

      expect(workspaceGroupStore).toBeTruthy();
      expect(workspaceGroupStore?.getState()['foo']).toBe(true);

      workspaceGroupStore = getWorkspaceGroupStore('ward-patient-store', {
        bar: true,
      });

      expect(workspaceGroupStore).toBeTruthy();
      expect(workspaceGroupStore?.getState()['foo']).toBe(true);
      expect(workspaceGroupStore?.getState()['bar']).toBe(true);
    });
  });

  describe('Testing workspace group store', () => {
    it('should create store for workspace groups', () => {
      registerWorkspace({
        name: 'allergies',
        title: 'Allergies',
        load: vi.fn(),
        moduleName: '@openmrs/foo',
      });
      registerWorkspace({
        name: 'ward-patient-workspace',
        title: 'Ward Patient Workspace',
        load: vi.fn(),
        type: 'ward-patient',
        moduleName: '@openmrs/esm-ward-app',
      });

      registerWorkspaceGroup({
        name: 'ward-patient-store',
        members: ['ward-patient-workspace'],
      });

      launchWorkspaceGroup('ward-patient-store', {
        state: {},
        workspaceToLaunch: { name: 'ward-patient-workspace' },
      });

      const workspaceGroupStore = getWorkspaceGroupStore('ward-patient-store');
      const workspaceStore = getWorkspaceStore();
      expect(workspaceStore.getState().openWorkspaces.length).toBe(1);
      expect(workspaceStore.getState().openWorkspaces[0].name).toBe('ward-patient-workspace');
      expect(workspaceGroupStore).toBeTruthy();

      workspaceStore.getState().openWorkspaces[0].closeWorkspace({ ignoreChanges: true });

      launchWorkspace('allergies');

      expect(workspaceStore.getState().openWorkspaces.length).toBe(1);
      expect(workspaceStore.getState().openWorkspaces[0].name).toBe('allergies');
      expect(workspaceGroupStore?.getState()).toStrictEqual({});
    });

    it('should clear workspace group store by default if the workspace is closed, since `closeWorkspaceGroup` is true by default', async () => {
      registerWorkspace({
        name: 'ward-patient-workspace',
        title: 'Ward Patient Workspace',
        load: vi.fn(),
        type: 'ward-patient',
        moduleName: '@openmrs/esm-ward-app',
      });
      registerWorkspaceGroup({
        name: 'ward-patient-store',
        members: ['ward-patient-workspace'],
      });
      launchWorkspaceGroup('ward-patient-store', {
        state: {
          foo: true,
        },
        workspaceToLaunch: { name: 'ward-patient-workspace' },
      });

      const workspaceGroupStore = getWorkspaceGroupStore('ward-patient-store');
      expect(workspaceGroupStore).toBeTruthy();
      expect(workspaceGroupStore?.getState()?.['foo']).toBe(true);

      closeWorkspace('ward-patient-workspace');

      expect(workspaceGroupStore?.getState()?.['foo']).toBeUndefined();
      expect(workspaceGroupStore?.getState()).toStrictEqual({});
    });

    it('should not clear the workspace store if the new workspace opened can open in the same group', () => {
      const workspaceGroup = 'ward-patient-store';
      registerWorkspace({
        name: 'ward-patient-workspace',
        title: 'Ward Patient Workspace',
        load: vi.fn(),
        type: 'ward-patient',
        moduleName: '@openmrs/esm-ward-app',
      });
      registerWorkspace({
        name: 'transfer-patient-workspace',
        title: 'Transfer Patient Workspace',
        load: vi.fn(),
        type: 'transfer-patient',
        moduleName: '@openmrs/esm-ward-app',
      });
      registerWorkspaceGroup({
        name: workspaceGroup,
        members: ['ward-patient-workspace', 'transfer-patient-workspace'],
      });

      launchWorkspaceGroup(workspaceGroup, {
        state: {
          foo: true,
        },
        workspaceToLaunch: { name: 'ward-patient-workspace' },
      });

      const workspaceStore = getWorkspaceStore();
      const workspaceGroupStore = getWorkspaceGroupStore(workspaceGroup);
      expect(workspaceStore.getState().openWorkspaces.length).toBe(1);
      expect(workspaceGroupStore).toBeTruthy();
      expect(workspaceGroupStore?.getState()?.['foo']).toBe(true);

      launchWorkspace('transfer-patient-workspace', {
        bar: false,
      });

      expect(workspaceStore.getState().openWorkspaces.length).toBe(1);

      const transferPatientWorkspace = workspaceStore.getState().openWorkspaces[0];
      expect(workspaceGroupStore?.getState()?.['foo']).toBe(true);
      expect(workspaceGroupStore?.getState()?.['bar']).toBe(false);
    });

    it('should clear the store when new workspace with different sidebar is opened, given the original workspace cannot hide', () => {
      registerWorkspace({
        name: 'ward-patient-workspace',
        title: 'Ward Patient Workspace',
        load: vi.fn(),
        type: 'ward-patient',
        moduleName: '@openmrs/esm-ward-app',
      });
      registerWorkspace({
        name: 'transfer-patient-workspace',
        title: 'Transfer Patient Workspace',
        load: vi.fn(),
        type: 'transfer-patient',
        moduleName: '@openmrs/esm-ward-app',
      });

      registerWorkspaceGroup({
        name: 'ward-patient-store',
        members: ['ward-patient-workspace'],
      });

      registerWorkspaceGroup({
        name: 'another-sidebar-group',
        members: ['transfer-patient-workspace'],
      });

      const workspaceStore = getWorkspaceStore();
      launchWorkspaceGroup('ward-patient-store', {
        state: {
          foo: true,
        },
        workspaceToLaunch: { name: 'ward-patient-workspace' },
      });

      const wardPatientGroupStore = getWorkspaceGroupStore('ward-patient-store');
      expect(workspaceStore.getState().openWorkspaces.length).toBe(1);
      expect(wardPatientGroupStore).toBeTruthy();
      expect(wardPatientGroupStore?.getState()?.['foo']).toBe(true);

      launchWorkspaceGroup('another-sidebar-group', {
        state: {
          bar: false,
        },
        workspaceToLaunch: { name: 'transfer-patient-workspace' },
      });

      expect(workspaceStore.getState().workspaceGroup?.name).toBe('another-sidebar-group');

      const anotherWorkspaceGroupStore = getWorkspaceGroupStore('another-sidebar-group');
      expect(workspaceStore.getState().openWorkspaces.length).toBe(1);
      expect(anotherWorkspaceGroupStore?.getState()?.['bar']).toBe(false);
      expect(wardPatientGroupStore?.getState()?.['foo']).toBeUndefined();
      expect(wardPatientGroupStore?.getState()).toStrictEqual({});
    });

    it('should not clear the workspace if a workspace of same sidebar group is opened', () => {
      registerWorkspace({
        name: 'ward-patient-workspace',
        title: 'Ward Patient Workspace',
        load: vi.fn(),
        type: 'ward-patient',
        moduleName: '@openmrs/esm-ward-app',
        canHide: true,
      });
      registerWorkspace({
        name: 'transfer-patient-workspace',
        title: 'Transfer Patient Workspace',
        load: vi.fn(),
        type: 'transfer-patient',
        moduleName: '@openmrs/esm-ward-app',
      });

      registerWorkspaceGroup({
        name: 'ward-patient-store',
        members: ['ward-patient-workspace', 'transfer-patient-workspace'],
      });

      const workspaceStore = getWorkspaceStore();

      launchWorkspaceGroup('ward-patient-store', {
        state: {
          foo: true,
        },
        workspaceToLaunch: { name: 'ward-patient-workspace' },
      });

      const wardPatientGroupStore = getWorkspaceGroupStore('ward-patient-store');
      expect(workspaceStore.getState().openWorkspaces.length).toBe(1);
      expect(wardPatientGroupStore).toBeTruthy();
      expect(wardPatientGroupStore?.getState()?.['foo']).toBe(true);

      launchWorkspace('transfer-patient-workspace', { bar: false });

      expect(workspaceStore.getState().openWorkspaces.length).toBe(2);
      expect(wardPatientGroupStore?.getState()?.['foo']).toBe(true);
      expect(wardPatientGroupStore?.getState()?.['bar']).toBe(false);
    });

    it('should retain default closeWorkspace options in case workspace options are passed', () => {
      registerWorkspace({
        name: 'ward-patient-workspace',
        title: 'Ward Patient Workspace',
        load: vi.fn(),
        type: 'ward-patient',
        moduleName: '@openmrs/esm-ward-app',
      });
      registerWorkspaceGroup({
        name: 'ward-patient-store',
        members: ['ward-patient-workspace'],
      });
      launchWorkspaceGroup('ward-patient-store', {
        state: { foo: true },
        workspaceToLaunch: { name: 'ward-patient-workspace' },
      });

      const workspaceGroupStore = getWorkspaceGroupStore('ward-patient-store');

      expect(workspaceGroupStore).toBeTruthy();
      expect(workspaceGroupStore?.getState()?.['foo']).toBe(true);

      // test that default options are interpolated when providing options to `closeWorkspace`
      closeWorkspace('ward-patient-workspace', { ignoreChanges: true });

      expect(workspaceGroupStore?.getState()?.['foo']).toBeUndefined();
      expect(workspaceGroupStore?.getState()).toStrictEqual({});
    });
  });
});
