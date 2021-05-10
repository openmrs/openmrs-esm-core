import "@testing-library/jest-dom/extend-expect";
import Dexie from "dexie";
import FakeIndexedDb from "fake-indexeddb";
import FakeDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";
const { getComputedStyle } = window;

window.getComputedStyle = (elt) => getComputedStyle(elt);
window.getOpenmrsSpaBase = jest.fn();
window["getOpenmrsSpaBase"] = jest.fn().mockImplementation(() => "/");

Dexie.dependencies.indexedDB = FakeIndexedDb;
Dexie.dependencies.IDBKeyRange = FakeDBKeyRange;
