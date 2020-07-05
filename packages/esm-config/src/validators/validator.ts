export function validator(
  validationFunction: ValidatorFunction,
  message: String
): Validator {
  return value => {
    if (!validationFunction(value)) {
      return message;
    }
  };
}

type ValidatorFunction = (value: any) => Boolean;

export type Validator = (value: any) => void | String;
