/** @category Utility */
import { type ArrowExpression } from '@jsep-plugin/arrow';
import { type NewExpression } from '@jsep-plugin/new';
import { type TemplateElement, type TemplateLiteral } from '@jsep-plugin/template';
import { jsep } from './evaluator';
import { globalsAsync } from './globals';

/**
 * `extractVariableNames()` is a companion function for `evaluate()` and `evaluateAsync()` which extracts the
 * names of all unbound identifiers used in the expression. The idea is to be able to extract all of the names
 * of variables that will need to be supplied in order to correctly process the expression.
 *
 * @example
 * ```ts
 * // variables will be ['isEmpty', 'array']
 * const variables = extractVariableNames('!isEmpty(array)')
 * ```
 *
 * An identifier is considered "unbound" if it is not a reference to the property of an object, is not defined
 * as a parameter to an inline arrow function, and is not a global value. E.g.,
 *
 * @example
 * ```ts
 * // variables will be ['obj']
 * const variables = extractVariableNames('obj.prop()')
 * ```
 *
 * @example
 * ```ts
 * // variables will be ['arr', 'needle']
 * const variables = extractVariableNames('arr.filter(v => v === needle)')
 * ```
 *
 @example
 * ```ts
 * // variables will be ['myVar']
 * const  variables = extractVariableNames('new String(myVar)')
 * ```
 *
 * Note that because this expression evaluator uses a restricted definition of "global" there are some Javascript
 * globals that will be reported as a unbound expression. This is expected because the evaluator will still fail
 * on these expressions.
 */
export function extractVariableNames(expression: string | jsep.Expression) {
  if (typeof expression !== 'string' && (typeof expression !== 'object' || !expression || !('type' in expression))) {
    throw `Unknown expression type ${expression}. Expressions must either be a string or pre-compiled string.`;
  }

  const context = createAsynchronousContext();
  visitExpression(typeof expression === 'string' ? jsep(expression) : expression, context);

  return [...context.variables];
}

function visitExpression(expression: jsep.Expression, context: EvaluationContext) {
  switch (expression.type) {
    case 'UnaryExpression':
      return visitUnaryExpression(expression as jsep.UnaryExpression, context);
    case 'BinaryExpression':
      return visitBinaryExpression(expression as jsep.BinaryExpression, context);
    case 'ConditionalExpression':
      return visitConditionalExpression(expression as jsep.ConditionalExpression, context);
    case 'CallExpression':
      return visitCallExpression(expression as jsep.CallExpression, context);
    case 'ArrowFunctionExpression':
      return visitArrowFunctionExpression(expression as ArrowExpression, context);
    case 'MemberExpression':
      return visitMemberExpression(expression as jsep.MemberExpression, context);
    case 'ArrayExpression':
      return visitArrayExpression(expression as jsep.ArrayExpression, context);
    case 'SequenceExpression':
      return visitSequenceExpression(expression as jsep.SequenceExpression, context);
    case 'NewExpression':
      return visitNewExpression(expression as NewExpression, context);
    case 'Literal':
      return visitLiteral(expression as jsep.Literal, context);
    case 'Identifier':
      return visitIdentifier(expression as jsep.Identifier, context);
    case 'TemplateLiteral':
      return visitTemplateLiteral(expression as TemplateLiteral, context);
    case 'TemplateElement':
      return visitTemplateElement(expression as TemplateElement, context);
    default:
      throw `Expression evaluator does not support expression of type '${expression.type}'`;
  }
}

function visitUnaryExpression(expression: jsep.UnaryExpression, context: EvaluationContext) {
  return visitExpression(expression.argument, context);
}

function visitBinaryExpression(expression: jsep.BinaryExpression, context: EvaluationContext) {
  const left = visitExpression(expression.left, context);
  const right = visitExpression(expression.right, context);
  return [left, right].filter(Boolean);
}

function visitConditionalExpression(expression: jsep.ConditionalExpression, context: EvaluationContext) {
  const consequent = visitExpression(expression.consequent, context);
  const test = visitExpression(expression.test, context);
  const alternate = visitExpression(expression.alternate, context);
  return [consequent, test, alternate].filter(Boolean);
}

function visitCallExpression(expression: jsep.CallExpression, context: EvaluationContext) {
  const fn = visitExpression(expression.callee, context);
  expression.arguments?.map(handleNullableExpression(context));
  return fn;
}

function visitArrowFunctionExpression(expression: ArrowExpression, context: EvaluationContext) {
  const newContext = { ...context };
  newContext.isLocalExpression = true;

  const params = expression.params?.map(handleNullableExpression(newContext)) ?? [];
  const bodyVariables = visitExpression(expression.body, newContext) ?? [];

  if (bodyVariables && Array.isArray(bodyVariables)) {
    for (const v of bodyVariables) {
      if (!params.includes(v)) {
        context.variables.add(v);
      }
    }
  }
}

function visitMemberExpression(expression: jsep.MemberExpression, context: EvaluationContext) {
  visitExpression(expression.object, context);
  const newContext = { ...context };
  newContext.isLocalExpression = true;
  visitExpression(expression.property, newContext);
}

function visitArrayExpression(expression: jsep.ArrayExpression, context: EvaluationContext) {
  expression.elements?.map(handleNullableExpression(context));
}

function visitSequenceExpression(expression: jsep.SequenceExpression, context: EvaluationContext) {
  expression.expressions?.map(handleNullableExpression(context));
}

function visitNewExpression(expression: NewExpression, context: EvaluationContext) {
  expression.arguments?.map(handleNullableExpression(context));
}

function visitTemplateLiteral(expression: TemplateLiteral, context: EvaluationContext) {
  expression.expressions?.map(handleNullableExpression(context));
  expression.quasis?.map(handleNullableExpression(context));
}

function visitTemplateElement(expression: TemplateElement, context: EvaluationContext) {}

function visitIdentifier(expression: jsep.Identifier, context: EvaluationContext) {
  if (!(expression.name in context.globals)) {
    if (!context.isLocalExpression) {
      context.variables.add(expression.name);
    } else {
      return expression.name;
    }
  }
}

function visitLiteral(expression: jsep.Literal, context: EvaluationContext) {}

// Internals
interface EvaluationContext {
  globals: typeof globalsAsync;
  isLocalExpression: boolean;
  variables: Set<string>;
}

function createAsynchronousContext(): EvaluationContext {
  return createContextInternal(globalsAsync);
}

function createContextInternal(globals_: typeof globalsAsync) {
  const context = {
    globals: { ...globals_ },
    isLocalExpression: false,
    variables: new Set<string>(),
  };

  return context;
}

function handleNullableExpression(context: EvaluationContext) {
  return function handleNullableExpressionInner(expression: jsep.Expression | null) {
    if (expression === null) {
      return null;
    }

    return visitExpression(expression, context);
  };
}
