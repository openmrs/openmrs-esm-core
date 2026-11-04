import { describe, expect, it } from 'vitest';
import { buildValidatorsModule } from './generate-validators';

const base = { outputPath: '/tmp/config-validators.generated.js' };

describe('the generated config-validators module', () => {
  it("re-exports the module's own validators file when it has one", () => {
    const generated = buildValidatorsModule({
      ...base,
      authoredValidatorsFile: '/app/src/config-validators.ts',
      transposed: [],
    });

    expect(generated).toContain('export * from "/app/src/config-validators.ts";');
  });

  it('is still a valid module when there is nothing to export', () => {
    // Module Federation fixes its exposes before the build starts, so this file has to exist even
    // when extraction finds no custom validators at all.
    const generated = buildValidatorsModule({ ...base, transposed: [] });

    expect(generated).toContain('export {};');
  });

  it('writes an inline validator out as an ordinary named export', () => {
    const generated = buildValidatorsModule({
      ...base,
      transposed: [
        { name: 'validator1', validationFunction: '(value)=>typeof value === "number"', message: '"must be a number"' },
      ],
    });

    expect(generated).toContain("import { validator } from '@openmrs/esm-framework';");
    expect(generated).toContain(
      'export const validator1 = validator((value)=>typeof value === "number", "must be a number");',
    );
  });

  it('writes a message that is itself a function', () => {
    const generated = buildValidatorsModule({
      ...base,
      transposed: [{ name: 'validator1', validationFunction: '(v)=>v > 0', message: '(v)=>`${v} is not positive`' }],
    });

    expect(generated).toContain('export const validator1 = validator((v)=>v > 0, (v)=>`${v} is not positive`);');
  });

  it('does not import the framework when there is nothing transposed', () => {
    // The point of this entry point is that loading a validator is cheap, so it should pull in
    // nothing it does not need.
    const generated = buildValidatorsModule({
      ...base,
      authoredValidatorsFile: '/app/src/config-validators.ts',
      transposed: [],
    });

    expect(generated).not.toContain('@openmrs/esm-framework');
  });

  it('combines authored exports with transposed ones', () => {
    const generated = buildValidatorsModule({
      ...base,
      authoredValidatorsFile: '/app/src/config-validators.ts',
      transposed: [
        { name: 'validator1', validationFunction: '(a)=>a', message: '"a"' },
        { name: 'validator2', validationFunction: '(b)=>b', message: '"b"' },
      ],
    });

    expect(generated).toContain('export * from "/app/src/config-validators.ts";');
    expect(generated).toContain('export const validator1 =');
    expect(generated).toContain('export const validator2 =');
  });

  it('never refers back to the module the validator was written in', () => {
    // A transposed validator is compiled into this entry point, so nothing here reaches into the
    // module's own bundle, which is the cost this design exists to avoid.
    const generated = buildValidatorsModule({
      ...base,
      transposed: [{ name: 'validator1', validationFunction: '(v)=>v', message: '"x"' }],
    });

    expect(generated).not.toContain('src/index');
    expect(generated).not.toContain('startupApp');
  });
});
