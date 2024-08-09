/** @category Utility */
import jsep from 'jsep';
import jsepArrow, { type ArrowExpression } from '@jsep-plugin/arrow';
import jsepNew, { type NewExpression } from '@jsep-plugin/new';
import jsepNumbers from '@jsep-plugin/numbers';
import jsepRegex from '@jsep-plugin/regex';
import jsepTernary from '@jsep-plugin/ternary';
import jsepTemplate, { type TemplateElement, type TemplateLiteral } from '@jsep-plugin/template';

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

/**
 * An object containing the variable to use when evaluating this expression
 */
export type VariablesMap = {
  [key: string]: string | number | boolean | Function | RegExp | object | null | VariablesMap | Array<VariablesMap>;
};

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
 * In addition to string expressions, `evaluate()` can use an existing jsep.Expression, such as that returned
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
 * `evaluateToType()` is a type-safe version of {@link evaluate()} which returns a result if the result
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
  if (typeof variables === 'undefined' || variables === null) {
    variables = {};
  }

  const result = visitExpression(typeof expression === 'string' ? jsep(expression) : expression, variables);
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

// Type guards
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

function booleanTypePredicate(result: unknown): result is Boolean {
  return typeof result === 'boolean';
}

function numberTypePredicate(result: unknown): result is number {
  return typeof result === 'number';
}

// Implementation

type ThisObj = object | null | undefined;

// This is the core of the implementation; it takes an expression, the variables and the current object
// each expression is dispatched to an appropriate handler.
function visitExpression(expression: jsep.Expression, variables: VariablesMap, thisObj: ThisObj = undefined) {
  switch (expression.type) {
    case 'UnaryExpression':
      return visitUnaryExpression(expression as jsep.UnaryExpression, variables, thisObj);
    case 'BinaryExpression':
      return visitBinaryExpression(expression as jsep.BinaryExpression, variables, thisObj);
    case 'ConditionalExpression':
      return visitConditionalExpression(expression as jsep.ConditionalExpression, variables, thisObj);
    case 'CallExpression':
      return visitCallExpression(expression as jsep.CallExpression, variables, thisObj);
    case 'ArrowFunctionExpression':
      return visitArrowFunctionExpression(expression as ArrowExpression, variables, thisObj);
    case 'MemberExpression':
      return visitMemberExpression(expression as jsep.MemberExpression, variables, thisObj);
    case 'ArrayExpression':
      return visitArrayExpression(expression as jsep.ArrayExpression, variables, thisObj);
    case 'SequenceExpression':
      return visitSequenceExpression(expression as jsep.SequenceExpression, variables, thisObj);
    case 'NewExpression':
      return visitNewExpression(expression as NewExpression, variables, thisObj);
    case 'Literal':
      return visitLiteral(expression as jsep.Literal, variables, thisObj);
    case 'Identifier':
      return visitIdentifier(expression as jsep.Identifier, variables, thisObj);
    case 'TemplateLiteral':
      return visitTemplateLiteral(expression as TemplateLiteral, variables, thisObj);
    case 'TemplateElement':
      return visitTemplateElement(expression as TemplateElement, variables, thisObj);
    default:
      throw `Expression evaluator does not support expression of type '${expression.type}'`;
  }
}

function visitUnaryExpression(expression: jsep.UnaryExpression, variables: VariablesMap, thisObj: ThisObj) {
  const value = visitExpression(expression.argument, variables, thisObj);

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

function visitBinaryExpression(expression: jsep.BinaryExpression, variables: VariablesMap, thisObj: ThisObj) {
  let left = visitExpression(expression.left, variables, thisObj);
  let right = visitExpression(expression.right, variables, thisObj);

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

function visitConditionalExpression(expression: jsep.ConditionalExpression, variables: VariablesMap, thisObj: ThisObj) {
  const test = visitExpression(expression.test, variables, thisObj);
  return test
    ? visitExpression(expression.consequent, variables, thisObj)
    : visitExpression(expression.alternate, variables, thisObj);
}

function visitCallExpression(expression: jsep.CallExpression, variables: VariablesMap, thisObj: ThisObj) {
  let args = expression.arguments?.map(handleNullableExpression(variables, thisObj));
  let callee = visitExpression(expression.callee, variables, thisObj);

  if (!callee) {
    throw `No function named ${expression.callee} is defined in this context`;
  } else if (!(callee instanceof Function)) {
    throw `${expression.callee} is not a function`;
  }

  return callee(...args);
}

function visitArrowFunctionExpression(expression: ArrowExpression, variables: VariablesMap, thisObj: ThisObj) {
  const params =
    expression.params?.map((p) => {
      switch (p.type) {
        case 'Identifier':
          return (p as jsep.Identifier).name;
        default:
          throw `Cannot handle parameter of type ${p.type}`;
      }
    }) ?? [];

  return function (...rest) {
    if (rest.length < params.length) {
      throw `Required argument(s) ${params.slice(rest.length, -1).join(', ')} were not provided`;
    }

    const vars = Object.fromEntries(
      params.reduce((acc: Array<[string, VariablesMap['a']]>, p, idx) => {
        acc.push([p, rest[idx]]);
        return acc;
      }, []),
    );

    return visitExpression(expression.body, { ...variables, ...vars }, thisObj);
  }.bind(thisObj);
}

function visitMemberExpression(expression: jsep.MemberExpression, variables: VariablesMap, thisObj: ThisObj) {
  const obj = visitExpression(expression.object, variables, thisObj);
  if (expression.property.name === '__proto__') {
    throw { type: 'Illegal property access', message: 'Cannot access the __proto__ property of objects' };
  }

  const result = visitExpression(expression.property, variables, obj);
  if (typeof result === 'function') {
    return result.bind(obj);
  }

  return result;
}

function visitArrayExpression(expression: jsep.ArrayExpression, variables: VariablesMap, thisObj: ThisObj) {
  return expression.elements?.map(handleNullableExpression(variables, thisObj));
}

function visitSequenceExpression(expression: jsep.SequenceExpression, variables: VariablesMap, thisObj: ThisObj) {
  const result = expression.expressions.map(handleNullableExpression(variables, thisObj));
  return result[result.length - 1];
}

function visitNewExpression(expression: NewExpression, variables: VariablesMap, thisObj: ThisObj) {
  if (expression.callee && expression.callee.type === 'Identifier') {
    let args = expression.arguments?.map(handleNullableExpression(variables, thisObj)) as Array<any>;
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

function visitTemplateLiteral(expression: TemplateLiteral, variables: VariablesMap, thisObj: ThisObj) {
  const expressions: Array<unknown> = expression.expressions?.map(handleNullableExpression(variables, thisObj)) ?? [];
  const quasis: Array<{ tail: boolean; value: unknown }> =
    expression.quasis?.map(handleNullableExpression(variables, thisObj)) ?? [];
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

function visitTemplateElement(expression: TemplateElement, variables: VariablesMap, thisObj: ThisObj) {
  return { value: expression.cooked, tail: expression.tail };
}

const globals = {
  Array,
  Boolean,
  Symbol,
  Infinity,
  NaN,
  Math,
  Number,
  BigInt,
  String,
  RegExp,
  JSON,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  decodeURI,
  encodeURI,
  encodeURIComponent,
  Object: {
    __proto__: undefined,
    assign: Object.assign.bind(null),
    fromEntries: Object.fromEntries.bind(null),
    hasOwn: Object.hasOwn.bind(null),
    keys: Object.keys.bind(null),
    is: Object.is.bind(null),
    values: Object.values.bind(null),
  },
};

function visitIdentifier(expression: jsep.Identifier, variables: VariablesMap, thisObj: ThisObj) {
  if (expression.name === '__proto__') {
    throw { type: 'Illegal property access', message: 'Cannot access the __proto__ property of objects' };
  } else if (thisObj && expression.name in thisObj) {
    const result = thisObj[expression.name];
    if (result === '__proto__') {
      throw { type: 'Illegal property access', message: 'Cannot access the __proto__ property of objects' };
    }
    return result;
  } else if (variables && expression.name in variables) {
    const result = variables[expression.name];
    if (result === '__proto__') {
      throw { type: 'Illegal property access', message: 'Cannot access the __proto__ property of objects' };
    }
    return result;
  } else if (expression.name in globals) {
    return globals[expression.name];
  } else {
    return undefined;
  }
}

function visitLiteral(expression: jsep.Literal, variables: VariablesMap, thisObj: ThisObj) {
  if (expression.value === '__proto__') {
    throw { type: 'Illegal property access', message: 'Cannot access the __proto__ property of objects' };
  }

  return expression.value;
}

// helper function used when mapping arrays of expressions, since arrays can have null elements
// and visitExpression expects only expressions
function handleNullableExpression(variables: VariablesMap, thisObj: ThisObj) {
  return function handleNullableExpressionInner(expression: jsep.Expression | null) {
    if (expression === null) {
      return null;
    }

    return visitExpression(expression, variables, thisObj);
  };
}
