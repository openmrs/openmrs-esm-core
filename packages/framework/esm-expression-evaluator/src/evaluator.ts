/** @category Utility */
import jsep, { type Expression, type MemberExpression } from 'jsep';
import jsepArrow, { type ArrowExpression } from '@jsep-plugin/arrow';
import jsepNew, { type NewExpression } from '@jsep-plugin/new';
import jsepNumbers from '@jsep-plugin/numbers';
import jsepRegex from '@jsep-plugin/regex';
import jsepTernary from '@jsep-plugin/ternary';
import jsepTemplate, { type TemplateElement, type TemplateLiteral } from '@jsep-plugin/template';
import { globals, globalsAsync } from './globals';

jsep.plugins.register(jsepArrow);
jsep.plugins.register(jsepNew);
jsep.plugins.register(jsepNumbers);
jsep.plugins.register(jsepRegex);
jsep.plugins.register(jsepTernary);
jsep.plugins.register(jsepTemplate);
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
// for the order defined here
// 7 is jsep's internal for "relational operators"
jsep.addBinaryOp('in', 7);
jsep.addBinaryOp('??', 1);

export { jsep };

/** An object containing the variable to use when evaluating this expression */
export type VariablesMap = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [key: string]: string | number | boolean | Function | RegExp | object | null | VariablesMap | Array<VariablesMap>;
};

/** The valid return types for `evaluate()` and `evaluateAsync()` */
export type DefaultEvaluateReturnType = string | number | boolean | Date | null | undefined;

/**
 * `evaluate()` implements a relatively safe version of `eval()` that is limited to evaluating synchronous
 * Javascript expressions. This allows us to safely add features that depend on user-supplied code without
 * polluting the global namespace or needing to support `eval()` and the like.
 *
 * By default it supports any expression that evalutes to a string, number, boolean, Date, null, or undefined.
 * Other values will result in an error.
 *
 * @example
 * ```ts
 * // shouldDisplayOptionalData will be false
 * const shouldDisplayOptionalData = evaluate('!isEmpty(array)', {
 *  array: [],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * })
 * ```
 *
 * Since this only implements the expression lanaguage part of Javascript, there is no support for assigning
 * values, creating functions, or creating objects, so the following will throw an error:
 *
 * @example
 * ```ts
 * evaluate('var a = 1; a');
 * ```
 *
 * In addition to string expressions, `evaluate()` can use an existing `jsep.Expression`, such as that returned
 * from the `compile()` function. The goal here is to support cases where the same expression will be evaluated
 * multiple times, possibly with different variables, e.g.,
 *
 * @example
 * ```ts
 * const expr = compile('isEmpty(array)');
 *
 * // then we use it like
 * evaluate(expr, {
 *  array: [],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * ));
 *
 * evaluate(expr, {
 *  array: ['value'],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * ));
 * ```
 *
 * This saves the overhead of parsing the expression everytime and simply allows us to evaluate it.
 *
 * The `variables` parameter should be used to supply any variables or functions that should be in-scope for
 * the evaluation. A very limited number of global objects, like NaN and Infinity are always available, but
 * any non-global values will need to be passed as a variable. Note that expressions do not have any access to
 * the variables in the scope in which they were defined unless they are supplied here.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export function evaluate(expression: string | jsep.Expression, variables: VariablesMap = {}) {
  return evaluateAsType(expression, variables, defaultTypePredicate);
}

/**
 * `evaluateAsync()` implements a relatively safe version of `eval()` that can evaluate Javascript expressions
 * that use Promises. This allows us to safely add features that depend on user-supplied code without
 * polluting the global namespace or needing to support `eval()` and the like.
 *
 * By default it supports any expression that evalutes to a string, number, boolean, Date, null, or undefined.
 * Other values will result in an error.
 *
 * @example
 * ```ts
 * // shouldDisplayOptionalData will be false
 * const shouldDisplayOptionalData = await evaluateAsync('Promise.resolve(!isEmpty(array))', {
 *  array: [],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * })
 * ```
 *
 * Since this only implements the expression lanaguage part of Javascript, there is no support for assigning
 * values, creating functions, or creating objects, so the following will throw an error:
 *
 * @example
 * ```ts
 * evaluateAsync('var a = 1; a');
 * ```
 *
 * In addition to string expressions, `evaluate()` can use an existing `jsep.Expression`, such as that returned
 * from the `compile()` function. The goal here is to support cases where the same expression will be evaluated
 * multiple times, possibly with different variables, e.g.,
 *
 * @example
 * ```ts
 * const expr = compile('Promise.resolve(isEmpty(array))');
 *
 * // then we use it like
 * evaluateAsync(expr, {
 *  array: [],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * ));
 *
 * evaluateAsync(expr, {
 *  array: ['value'],
 *  isEmpty(arr: unknown) {
 *   return Array.isArray(arr) && arr.length === 0;
 *  }
 * ));
 * ```
 *
 * This saves the overhead of parsing the expression everytime and simply allows us to evaluate it.
 *
 * The `variables` parameter should be used to supply any variables or functions that should be in-scope for
 * the evaluation. A very limited number of global objects, like NaN and Infinity are always available, but
 * any non-global values will need to be passed as a variable. Note that expressions do not have any access to
 * the variables in the scope in which they were defined unless they are supplied here.
 *
 * **Note:** `evaluateAsync()` currently only supports Promise-based asynchronous flows and does not support
 * the `await` keyword.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export async function evaluateAsync(expression: string | jsep.Expression, variables: VariablesMap = {}) {
  return evaluateAsTypeAsync(expression, variables, defaultTypePredicate);
}

/**
 * `evaluateAsBoolean()` is a variant of {@link evaluate()} which only supports boolean results. Useful
 * if valid expression must return boolean values.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export function evaluateAsBoolean(expression: string | jsep.Expression, variables: VariablesMap = {}) {
  return evaluateAsType(expression, variables, booleanTypePredicate);
}

/**
 * `evaluateAsBooleanAsync()` is a variant of {@link evaluateAsync()} which only supports boolean results. Useful
 * if valid expression must return boolean values.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export function evaluateAsBooleanAsync(expression: string | jsep.Expression, variables: VariablesMap = {}) {
  return evaluateAsTypeAsync(expression, variables, booleanTypePredicate);
}

/**
 * `evaluateAsNumber()` is a variant of {@link evaluate()} which only supports number results. Useful
 * if valid expression must return numeric values.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export function evaluateAsNumber(expression: string | jsep.Expression, variables: VariablesMap = {}) {
  return evaluateAsType(expression, variables, numberTypePredicate);
}

/**
 * `evaluateAsNumberAsync()` is a variant of {@link evaluateAsync()} which only supports number results. Useful
 * if valid expression must return numeric values.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @returns The result of evaluating the expression
 */
export function evaluateAsNumberAsync(expression: string | jsep.Expression, variables: VariablesMap = {}) {
  return evaluateAsTypeAsync(expression, variables, numberTypePredicate);
}

/**
 * `evaluateAsType()` is a type-safe version of {@link evaluate()} which returns a result if the result
 * passes a custom type predicate. The main use-case for this is to narrow the return types allowed based on
 * context, e.g., if the expected result should be a number or boolean, you can supply a custom type-guard
 * to ensure that only number or boolean results are returned.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @param typePredicate A [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
 *  which asserts that the result value matches one of the expected results.
 * @returns The result of evaluating the expression
 */
export function evaluateAsType<T>(
  expression: string | jsep.Expression,
  variables: VariablesMap = {},
  typePredicate: (result: unknown) => result is T,
): T {
  if (typeof expression !== 'string' && (typeof expression !== 'object' || !expression || !('type' in expression))) {
    throw `Unknown expression type ${expression}. Expressions must either be a string or pre-compiled string.`;
  }

  if (typeof expression === 'string' && expression.trim().length === 0) {
    throw {
      type: 'Empty expression',
      message: 'Expression cannot be an empty string',
    };
  }

  if (typeof variables === 'undefined' || variables === null) {
    variables = {};
  }

  const context = createSynchronousContext(variables);
  const result = visitExpression(typeof expression === 'string' ? jsep(expression) : expression, context);

  if (typePredicate(result)) {
    return result;
  } else {
    throw {
      type: 'Invalid result',
      message:
        typeof expression === 'string'
          ? `The expression ${expression} did not produce a valid result`
          : 'The expression did not produce a valid result',
    };
  }
}

/**
 * `evaluateAsTypeAsync()` is a type-safe version of {@link evaluateAsync()} which returns a result if the result
 * passes a custom type predicate. The main use-case for this is to narrow the return types allowed based on
 * context, e.g., if the expected result should be a number or boolean, you can supply a custom type-guard
 * to ensure that only number or boolean results are returned.
 *
 * @param expression The expression to evaluate, either as a string or pre-parsed expression
 * @param variables Optional object which contains any variables, functions, etc. that will be available to
 *  the expression.
 * @param typePredicate A [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
 *  which asserts that the result value matches one of the expected results.
 * @returns The result of evaluating the expression
 */
export async function evaluateAsTypeAsync<T>(
  expression: string | jsep.Expression,
  variables: VariablesMap = {},
  typePredicate: (result: unknown) => result is T,
): Promise<T> {
  if (typeof expression !== 'string' && (typeof expression !== 'object' || !expression || !('type' in expression))) {
    return Promise.reject(
      `Unknown expression type ${expression}. Expressions must either be a string or pre-compiled string.`,
    );
  }

  if (typeof expression === 'string' && expression.trim().length === 0) {
    throw {
      type: 'Empty expression',
      message: 'Expression cannot be an empty string',
    };
  }

  if (typeof variables === 'undefined' || variables === null) {
    variables = {};
  }

  const context = createAsynchronousContext(variables);
  return Promise.resolve(visitExpression(typeof expression === 'string' ? jsep(expression) : expression, context)).then(
    (result) => {
      if (typePredicate(result)) {
        return result;
      } else {
        throw {
          type: 'Invalid result',
          message:
            typeof expression === 'string'
              ? `The expression ${expression} did not produce a valid result`
              : 'The expression did not produce a valid result',
        };
      }
    },
  );
}

/**
 * `compile()` is a companion function for use with {@link evaluate()} and the various `evaluateAs*()` functions.
 * It processes an expression string into the resulting AST that is executed by those functions. This is useful if
 * you have an expression that will need to be evaluated mulitple times, potentially with different values, as the
 * lexing and parsing steps can be skipped by using the AST object returned from this.
 *
 * The returned AST is intended to be opaque to client applications, but, of course, it is possible to manipulate
 * the AST before passing it back to {@link evaluate()}, if desired. This might be useful if, for example, certain
 * values are known to be constant.
 *
 * @param expression The expression to be parsed
 * @returns An executable AST representation of the expression
 */
export function compile(expression: string): jsep.Expression {
  return jsep(expression);
}

// Pre-defined type guards
function defaultTypePredicate(result: unknown): result is DefaultEvaluateReturnType {
  return (
    typeof result === 'string' ||
    typeof result === 'number' ||
    typeof result === 'boolean' ||
    typeof result === 'undefined' ||
    result === null ||
    result instanceof Date
  );
}

function booleanTypePredicate(result: unknown): result is boolean {
  return typeof result === 'boolean';
}

function numberTypePredicate(result: unknown): result is number {
  return typeof result === 'number';
}

// Implementation

// This is the core of the implementation; it takes an expression, the variables and the current object
// each expression is dispatched to an appropriate handler.
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

function visitExpressionName(expression: jsep.Expression, context: EvaluationContext) {
  switch (expression.type) {
    case 'Literal':
      return (expression as jsep.Literal).value as string;
    case 'Identifier':
      return (expression as jsep.Identifier).name;
    case 'MemberExpression':
      return visitExpressionName((expression as jsep.MemberExpression).property, context);
    default:
      throw `VisitExpressionName does not support expression of type '${expression.type}'`;
  }
}

function visitUnaryExpression(expression: jsep.UnaryExpression, context: EvaluationContext) {
  const value = visitExpression(expression.argument, context);

  switch (expression.operator) {
    case '+':
      return +value;
    case '-':
      return -value;
    case '~':
      return ~value;
    case '!':
      return !value;
    default:
      throw `Expression evaluator does not support operator '${expression.operator}''`;
  }
}

function visitBinaryExpression(expression: jsep.BinaryExpression, context: EvaluationContext) {
  let left = visitExpression(expression.left, context);
  let right = visitExpression(expression.right, context);

  switch (expression.operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return left / right;
    case '%':
      return left % right;
    case '**':
      return left ** right;
    case '==':
      return left == right;
    case '===':
      return left === right;
    case '!=':
      return left != right;
    case '!==':
      return left !== right;
    case '>':
      return left > right;
    case '>=':
      return left >= right;
    case '<':
      return left < right;
    case '<=':
      return left <= right;
    case 'in':
      return left in right;
    case '&&':
      return left && right;
    case '||':
      return left || right;
    case '??':
      return left ?? right;
    default:
      throw `Expression evaluator does not support operator '${expression.operator}' operator`;
  }
}

function visitConditionalExpression(expression: jsep.ConditionalExpression, context: EvaluationContext) {
  const test = visitExpression(expression.test, context);
  return test ? visitExpression(expression.consequent, context) : visitExpression(expression.alternate, context);
}

function visitCallExpression(expression: jsep.CallExpression, context: EvaluationContext) {
  let args = expression.arguments?.map(handleNullableExpression(context));
  let callee = visitExpression(expression.callee, context);

  if (!callee) {
    throw `No function named ${getCallTargetName(expression.callee)} is defined in this context`;
  } else if (!(typeof callee === 'function')) {
    throw `${getCallTargetName(expression.callee)} is not a function`;
  }

  return callee(...args);
}

function visitArrowFunctionExpression(expression: ArrowExpression, context: EvaluationContext) {
  const params =
    expression.params?.map((p) => {
      switch (p.type) {
        case 'Identifier':
          return (p as jsep.Identifier).name;
        default:
          throw `Cannot handle parameter of type ${p.type}`;
      }
    }) ?? [];

  return function (...rest: unknown[]) {
    if (rest.length < params.length) {
      throw `Required argument(s) ${params.slice(rest.length, -1).join(', ')} were not provided`;
    }

    const vars = Object.fromEntries(
      params.reduce((acc: Array<[string, VariablesMap['a']]>, p, idx) => {
        const val = rest[idx];
        if (isValidVariableType(val)) {
          acc.push([p, val]);
        }
        return acc;
      }, []),
    );

    return visitExpression(expression.body, context.addVariables(vars));
  }.bind(context.thisObj ?? null);
}

function visitMemberExpression(expression: jsep.MemberExpression, context: EvaluationContext) {
  let obj = visitExpression(expression.object, context);

  if (obj === undefined) {
    switch (expression.object.type) {
      case 'Identifier': {
        let objectName = visitExpressionName(expression.object, context);
        throw ReferenceError(`ReferenceError: ${objectName} is not defined`);
      }
      case 'MemberExpression': {
        let propertyName = visitExpressionName(expression.property, context);
        throw TypeError(`TypeError: cannot read properties of undefined (reading '${propertyName}')`);
      }
      default:
        throw `VisitMemberExpression does not support operator '${expression.object.type}' type`;
    }
  }

  let newObj = obj;
  if (typeof obj === 'string') {
    newObj = String.prototype;
  } else if (typeof obj === 'number') {
    newObj = Number.prototype;
  } else if (typeof obj === 'function') {
    // no-op
  } else if (typeof obj !== 'object') {
    throw `VisitMemberExpression does not support member access on type ${typeof obj}`;
  }

  context.thisObj = newObj;

  let result: unknown;
  switch (expression.property.type) {
    case 'Identifier':
    case 'MemberExpression':
      result = visitExpression(expression.property, context);
      break;
    default: {
      const property = visitExpression(expression.property, context);
      if (typeof property === 'undefined') {
        throw { type: 'Illegal property access', message: 'No property was supplied to the property access' };
      }
      validatePropertyName(property);
      result = obj[property];
    }
  }

  if (typeof result === 'function') {
    return result.bind(obj);
  }

  return result;
}

function visitArrayExpression(expression: jsep.ArrayExpression, context: EvaluationContext) {
  return expression.elements?.map(handleNullableExpression(context));
}

function visitSequenceExpression(expression: jsep.SequenceExpression, context: EvaluationContext) {
  const result = expression.expressions.map(handleNullableExpression(context));
  return result[result.length - 1];
}

function visitNewExpression(expression: NewExpression, context: EvaluationContext) {
  if (expression.callee && expression.callee.type === 'Identifier') {
    let args = expression.arguments?.map(handleNullableExpression(context)) as Array<any>;
    switch (expression.callee.name) {
      case 'Date': {
        /** @ts-ignore because we can use the spread operator here */
        return new Date(...args);
      }
      case 'RegExp':
        /** @ts-ignore because we can use the spread operator here */
        return new RegExp(...args);
      default:
        throw `Cannot instantiate object of type ${expression.callee.name}`;
    }
  } else {
    if (!expression.callee) {
      throw `Could not handle "new" without a specified class`;
    } else {
      throw 'new must be called with either Date or RegExp';
    }
  }
}

function visitTemplateLiteral(expression: TemplateLiteral, context: EvaluationContext) {
  const expressions: Array<unknown> = expression.expressions?.map(handleNullableExpression(context)) ?? [];
  const quasis: Array<{ tail: boolean; value: unknown }> =
    expression.quasis?.map(handleNullableExpression(context)) ?? [];
  return (
    quasis
      .filter((q) => !q.tail)
      .map((q) => q.value)
      .join('') +
    expressions.join('') +
    quasis
      .filter((q) => q.tail)
      .map((q) => q.value)
      .join('')
  );
}

function visitTemplateElement(expression: TemplateElement, context: EvaluationContext) {
  return { value: expression.cooked, tail: expression.tail };
}

function visitIdentifier(expression: jsep.Identifier, context: EvaluationContext) {
  validatePropertyName(expression.name);

  // we support both `object` and `function` in the same way as technically property access on functions
  // is possible; the use-case here is to support JS's "static" functions like `Number.isInteger()`, which
  // is technically reading a property on a function
  const thisObj = context.thisObj;
  if (thisObj && (typeof thisObj === 'object' || typeof thisObj === 'function') && expression.name in thisObj) {
    const result = thisObj[expression.name];
    validatePropertyName(result);
    return result;
  } else if (context.variables && expression.name in context.variables) {
    const result = context.variables[expression.name];
    validatePropertyName(result);
    return result;
  } else if (expression.name in context.globals) {
    return context.globals[expression.name];
  } else {
    return undefined;
  }
}

function visitLiteral(expression: jsep.Literal, context: EvaluationContext) {
  validatePropertyName(expression.value);
  return expression.value;
}

// Internal helpers and utilities

interface EvaluationContext {
  thisObj: object | undefined;
  variables: VariablesMap;
  globals: typeof globals | typeof globalsAsync;
  addVariables(vars: VariablesMap): EvaluationContext;
}

function createSynchronousContext(variables: VariablesMap): EvaluationContext {
  return createContextInternal(variables, globals);
}

function createAsynchronousContext(variables: VariablesMap): EvaluationContext {
  return createContextInternal(variables, globalsAsync);
}

function createContextInternal(variables: VariablesMap, globals_: typeof globals | typeof globalsAsync) {
  const context = {
    thisObj: undefined,
    variables: { ...variables },
    globals: { ...globals_ },
    addVariables(vars: VariablesMap) {
      this.variables = { ...this.variables, ...vars };
      return this;
    },
  };

  context.addVariables.bind(context);

  return context;
}

// helper useful for handling arrays of expressions, since `null` expressions should not be
// dispatched to `visitExpression()`
function handleNullableExpression(context: EvaluationContext) {
  return function handleNullableExpressionInner(expression: jsep.Expression | null) {
    if (expression === null) {
      return null;
    }

    return visitExpression(expression, context);
  };
}

function validatePropertyName(name: unknown) {
  if (name === '__proto__' || name === 'prototype' || name === 'constructor') {
    throw { type: 'Illegal property access', message: `Cannot access the ${name} property of objects` };
  }
}

function isValidVariableType(val: unknown): val is VariablesMap['a'] {
  if (
    typeof val === 'string' ||
    typeof val === 'number' ||
    typeof val === 'boolean' ||
    typeof val === 'function' ||
    val === null ||
    val instanceof RegExp
  ) {
    return true;
  }

  if (typeof val === 'object') {
    for (const key of Object.keys(val)) {
      if (!isValidVariableType(val[key])) {
        return false;
      }
    }

    return true;
  }

  if (Array.isArray(val)) {
    for (const item of val) {
      if (!isValidVariableType(item)) {
        return false;
      }
    }
  }

  return false;
}

function getCallTargetName(expression: Expression) {
  if (!expression) {
    return null;
  }
  if (expression.type === 'MemberExpression') {
    return (expression.property as MemberExpression)?.name;
  }
  // identifier expression
  return expression.name;
}
