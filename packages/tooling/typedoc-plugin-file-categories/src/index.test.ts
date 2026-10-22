import { describe, expect, it, vi } from 'vitest';
import { Converter, ReflectionCategory, ReflectionKind, type Application } from 'typedoc';
import { load } from './index';

describe('typedoc-plugin-file-categories', () => {
  function createMockApp() {
    let declarationHandler: ((context: any, reflection: any) => void) | null = null;

    const mockApp = {
      converter: {
        on: vi.fn((event: string, handler: (context: any, reflection: any) => void) => {
          if (event === Converter.EVENT_CREATE_DECLARATION) {
            declarationHandler = handler;
          }
        }),
      },
    } as unknown as Application;

    return {
      mockApp,
      triggerDeclaration: (context: any, reflection: any) => {
        declarationHandler?.(context, reflection);
      },
    };
  }

  it('registers listener on Converter.EVENT_CREATE_DECLARATION', () => {
    const { mockApp } = createMockApp();
    load(mockApp);

    expect(mockApp.converter.on).toHaveBeenCalledWith(
      Converter.EVENT_CREATE_DECLARATION,
      expect.any(Function),
    );
  });

  it('ignores reflections with unprocessed kinds', () => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const mockContext = {
      program: { getSourceFile: vi.fn() },
      project: { categories: [] },
    };
    const mockReflection = {
      kind: ReflectionKind.Property,
      sources: [{ fullFileName: '/src/file.ts' }],
    };

    triggerDeclaration(mockContext, mockReflection);
    expect(mockContext.program.getSourceFile).not.toHaveBeenCalled();
  });

  it('ignores reflections without sources or when getSourceFile returns null', () => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const mockContext = {
      program: { getSourceFile: vi.fn().mockReturnValue(null) },
      getFileComment: vi.fn(),
      project: { categories: [] },
    };

    // No sources
    triggerDeclaration(mockContext, { kind: ReflectionKind.Function, sources: [] });
    expect(mockContext.program.getSourceFile).not.toHaveBeenCalled();

    // Source exists but sourceFile not found in program
    triggerDeclaration(mockContext, {
      kind: ReflectionKind.Function,
      sources: [{ fullFileName: '/src/missing.ts' }],
    });
    expect(mockContext.program.getSourceFile).toHaveBeenCalledWith('/src/missing.ts');
    expect(mockContext.getFileComment).not.toHaveBeenCalled();
  });

  it('ignores reflections when file comment or @category tag is absent or empty', () => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const mockSourceFile = {};
    const mockContext = {
      program: { getSourceFile: vi.fn().mockReturnValue(mockSourceFile) },
      getFileComment: vi.fn(),
      project: { categories: [] },
    };

    // No comment
    mockContext.getFileComment.mockReturnValueOnce(null);
    triggerDeclaration(mockContext, {
      kind: ReflectionKind.Class,
      sources: [{ fullFileName: '/src/class.ts' }],
    });
    expect(mockContext.project.categories).toEqual([]);

    // Comment without @category tag
    mockContext.getFileComment.mockReturnValueOnce({ blockTags: [] });
    triggerDeclaration(mockContext, {
      kind: ReflectionKind.Class,
      sources: [{ fullFileName: '/src/class.ts' }],
    });
    expect(mockContext.project.categories).toEqual([]);

    // @category tag with empty content
    mockContext.getFileComment.mockReturnValueOnce({
      blockTags: [{ tag: '@category', content: [] }],
    });
    triggerDeclaration(mockContext, {
      kind: ReflectionKind.Class,
      sources: [{ fullFileName: '/src/class.ts' }],
    });
    expect(mockContext.project.categories).toEqual([]);
  });

  it('creates a new category and adds the reflection when category does not exist', () => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const mockSourceFile = {};
    const mockContext: any = {
      program: { getSourceFile: vi.fn().mockReturnValue(mockSourceFile) },
      getFileComment: vi.fn().mockReturnValue({
        blockTags: [
          {
            tag: '@category',
            content: [{ kind: 'text', text: 'Navigation' }],
          },
        ],
      }),
      project: {},
    };

    const mockReflection: any = {
      kind: ReflectionKind.Function,
      sources: [{ fullFileName: '/src/nav.ts' }],
    };

    triggerDeclaration(mockContext, mockReflection);

    expect(mockContext.project.categories).toBeDefined();
    expect(mockContext.project.categories.length).toBe(1);
    expect(mockContext.project.categories[0].title).toBe('Navigation');
    expect(mockContext.project.categories[0].children).toEqual([mockReflection]);
  });

  it('appends to an existing category when category title matches', () => {
    const { mockApp, triggerDeclaration } = createMockApp();
    load(mockApp);

    const existingCategory = new ReflectionCategory('State');
    const firstReflection: any = { kind: ReflectionKind.Interface, name: 'StateInterface' };
    existingCategory.children = [firstReflection];

    const mockSourceFile = {};
    const mockContext: any = {
      program: { getSourceFile: vi.fn().mockReturnValue(mockSourceFile) },
      getFileComment: vi.fn().mockReturnValue({
        blockTags: [
          {
            tag: '@category',
            content: [{ kind: 'text', text: 'State' }],
          },
        ],
      }),
      project: {
        categories: [existingCategory],
      },
    };

    const secondReflection: any = {
      kind: ReflectionKind.Function,
      name: 'getState',
      sources: [{ fullFileName: '/src/state.ts' }],
    };

    triggerDeclaration(mockContext, secondReflection);

    expect(mockContext.project.categories.length).toBe(1);
    expect(mockContext.project.categories[0].title).toBe('State');
    expect(mockContext.project.categories[0].children).toEqual([firstReflection, secondReflection]);
  });
});
