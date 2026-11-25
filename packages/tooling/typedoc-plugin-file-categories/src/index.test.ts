import { describe, expect, it, vi } from 'vitest';
import {
  Converter,
  FileRegistry,
  ReflectionCategory,
  ReflectionKind,
  DeclarationReflection,
  ProjectReflection,
  SourceReference,
  Comment,
  CommentTag,
  type Application,
  type Context,
} from 'typedoc';
import type * as ts from 'typescript';
import { load } from './index';

type DeclarationHandler = (context: Context, reflection: DeclarationReflection) => void;

describe('typedoc-plugin-file-categories', () => {
  function createMockApp() {
    let declarationHandler: DeclarationHandler | null = null;
    const mockOn = vi.fn((event: string, handler: DeclarationHandler) => {
      if (event === Converter.EVENT_CREATE_DECLARATION) {
        declarationHandler = handler;
      }
    });

    const mockApp = {
      converter: {
        on: mockOn,
      },
    } as unknown as Application;

    return {
      mockApp,
      mockOn,
      triggerDeclaration: (context: Context, reflection: DeclarationReflection) => {
        declarationHandler?.(context, reflection);
      },
    };
  }

  it('registers listener on Converter.EVENT_CREATE_DECLARATION', () => {
    const { mockApp, mockOn } = createMockApp();
    load(mockApp);

    expect(mockOn).toHaveBeenCalledWith(Converter.EVENT_CREATE_DECLARATION, expect.any(Function));
  });

  it('ignores reflections with unprocessed kinds', () => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const mockContext = {
      program: { getSourceFile: vi.fn() },
      project: new ProjectReflection('test', new FileRegistry()),
    } as unknown as Context;
    const mockReflection = new DeclarationReflection('prop', ReflectionKind.Property);
    mockReflection.sources = [new SourceReference('/src/file.ts', 1, 1)];

    triggerDeclaration(mockContext, mockReflection);
    expect(mockContext.program.getSourceFile).not.toHaveBeenCalled();
  });

  it('ignores reflections without sources or when getSourceFile returns null', () => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const mockContext = {
      program: { getSourceFile: vi.fn().mockReturnValue(null) },
      getFileComment: vi.fn(),
      project: new ProjectReflection('test', new FileRegistry()),
    } as unknown as Context;

    // No sources
    const reflectionWithoutSources = new DeclarationReflection('fnNoSources', ReflectionKind.Function);
    reflectionWithoutSources.sources = [];
    triggerDeclaration(mockContext, reflectionWithoutSources);
    expect(mockContext.program.getSourceFile).not.toHaveBeenCalled();

    // Source exists but sourceFile not found in program
    const reflectionWithMissingSource = new DeclarationReflection('fnMissingSource', ReflectionKind.Function);
    reflectionWithMissingSource.sources = [new SourceReference('/src/missing.ts', 1, 1)];
    triggerDeclaration(mockContext, reflectionWithMissingSource);
    expect(mockContext.program.getSourceFile).toHaveBeenCalledWith('/src/missing.ts');
    expect(mockContext.getFileComment).not.toHaveBeenCalled();
  });

  it.each([
    { scenario: 'file comment is absent', comment: null },
    { scenario: 'comment has no @category tag', comment: new Comment() },
    {
      scenario: '@category tag content is empty',
      comment: (() => {
        const comment = new Comment();
        comment.blockTags.push(new CommentTag('@category', []));
        return comment;
      })(),
    },
  ])('ignores reflections when $scenario', ({ comment }) => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const mockSourceFile = {} as ts.SourceFile;
    const project = new ProjectReflection('test', new FileRegistry());
    project.categories = [];
    const mockContext = {
      program: { getSourceFile: vi.fn().mockReturnValue(mockSourceFile) },
      getFileComment: vi.fn().mockReturnValue(comment),
      project,
    } as unknown as Context;

    const mockReflection = new DeclarationReflection('TestClass', ReflectionKind.Class);
    mockReflection.sources = [new SourceReference('/src/class.ts', 1, 1)];

    triggerDeclaration(mockContext, mockReflection);
    expect(mockContext.project.categories).toEqual([]);
  });

  it('creates a new category and adds the reflection when category does not exist', () => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const comment = new Comment();
    comment.blockTags.push(new CommentTag('@category', [{ kind: 'text', text: 'Navigation' }]));

    const mockSourceFile = {} as ts.SourceFile;
    const project = new ProjectReflection('test', new FileRegistry());
    const mockContext = {
      program: { getSourceFile: vi.fn().mockReturnValue(mockSourceFile) },
      getFileComment: vi.fn().mockReturnValue(comment),
      project,
    } as unknown as Context;

    const mockReflection = new DeclarationReflection('navFunc', ReflectionKind.Function);
    mockReflection.sources = [new SourceReference('/src/nav.ts', 1, 1)];

    triggerDeclaration(mockContext, mockReflection);

    expect(project.categories).toBeDefined();
    expect(project.categories?.length).toBe(1);
    expect(project.categories?.[0].title).toBe('Navigation');
    expect(project.categories?.[0].children).toEqual([mockReflection]);
  });

  it('appends to an existing category when category title matches', () => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const existingCategory = new ReflectionCategory('State');
    const firstReflection = new DeclarationReflection('StateInterface', ReflectionKind.Interface);
    existingCategory.children = [firstReflection];

    const comment = new Comment();
    comment.blockTags.push(new CommentTag('@category', [{ kind: 'text', text: 'State' }]));

    const mockSourceFile = {} as ts.SourceFile;
    const project = new ProjectReflection('test', new FileRegistry());
    project.categories = [existingCategory];

    const mockContext = {
      program: { getSourceFile: vi.fn().mockReturnValue(mockSourceFile) },
      getFileComment: vi.fn().mockReturnValue(comment),
      project,
    } as unknown as Context;

    const secondReflection = new DeclarationReflection('getState', ReflectionKind.Function);
    secondReflection.sources = [new SourceReference('/src/state.ts', 1, 1)];

    triggerDeclaration(mockContext, secondReflection);

    expect(project.categories?.length).toBe(1);
    expect(project.categories?.[0].title).toBe('State');
    expect(project.categories?.[0].children).toEqual([firstReflection, secondReflection]);
  });
});
