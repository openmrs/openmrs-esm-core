import { type Application, Converter, ReflectionCategory, ReflectionKind, type ConverterEvents } from 'typedoc';
import type { EventDispatcher } from 'typedoc/dist/lib/utils-common';

const PROCESSED_KINDS = ReflectionKind.Class | ReflectionKind.Function | ReflectionKind.Interface;

export function load(typedoc: Readonly<Application>) {
  (typedoc.converter as Converter & EventDispatcher<ConverterEvents>).on(
    Converter.EVENT_CREATE_DECLARATION,
    (context, reflection) => {
      if ((reflection.kind & PROCESSED_KINDS) !== reflection.kind) {
        return;
      }

      const sourceFile = reflection.sources?.[0].fullFileName;

      if (sourceFile) {
        const file = context.program.getSourceFile(sourceFile);

        if (file) {
          const comment = context.getFileComment(file);

          if (comment) {
            const categoryTag = comment.blockTags.find((commentTag) => commentTag.tag === '@category');

            if (categoryTag && categoryTag.content.length > 0) {
              const categoryName = categoryTag.content.find((content) => content.kind === 'text');

              if (categoryName) {
                let category = context.project.categories?.find((category) => category.title === categoryName.text);

                if (!category) {
                  category = new ReflectionCategory(categoryName.text);

                  if (!context.project.categories) {
                    context.project.categories = [category];
                  } else {
                    context.project.categories.push(category);
                  }
                }

                if (category.children) {
                  category.children.push(reflection);
                } else {
                  category.children = [reflection];
                }
              }
            }
          }
        }
      }
    },
  );
}
