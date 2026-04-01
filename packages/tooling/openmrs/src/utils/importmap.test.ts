import { describe, expect, it } from 'vitest';
import { checkImportmapJson, checkRoutesJson } from './importmap';

describe('checkImportmapJson', () => {
  it('should return true for a valid import map', () => {
    expect(checkImportmapJson('{"imports":{"@openmrs/foo":"https://example.com/foo.js"}}')).toBe(true);
  });

  it('should return true for an empty import map', () => {
    expect(checkImportmapJson('{"imports":{}}')).toBe(true);
  });

  it('should return false for valid JSON without an imports key', () => {
    expect(checkImportmapJson('{"modules":{}}')).toBe(false);
  });

  it('should return false for valid JSON where imports is not an object', () => {
    expect(checkImportmapJson('{"imports":"not an object"}')).toBe(false);
  });

  it('should return false for invalid JSON', () => {
    expect(checkImportmapJson('not json')).toBe(false);
  });

  it('should return false for null', () => {
    expect(checkImportmapJson('null')).toBe(false);
  });
});

describe('checkRoutesJson', () => {
  it('should return true for a valid routes registry', () => {
    expect(checkRoutesJson('{"@openmrs/foo":{"pages":[]}}')).toBe(true);
  });

  it('should return true for an empty routes registry', () => {
    expect(checkRoutesJson('{}')).toBe(true);
  });

  it('should return false when a value is not an object', () => {
    expect(checkRoutesJson('{"@openmrs/foo":"not an object"}')).toBe(false);
  });

  it('should return false for invalid JSON', () => {
    expect(checkRoutesJson('not json')).toBe(false);
  });

  it('should return false for null', () => {
    expect(checkRoutesJson('null')).toBe(false);
  });
});
