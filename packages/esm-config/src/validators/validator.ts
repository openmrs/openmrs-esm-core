export function validator(
  validationFunction: ValidatorFunction,
  message: string
): Validator {
  return value => {
    if (!validationFunction(value)) {
      return message;
    }
  };
}

type ValidatorFunction = (value: any) => boolean;

export type Validator = (value: any) => void | string;
