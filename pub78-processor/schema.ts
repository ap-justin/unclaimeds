import type { StrictSchemaMap, ValidationResult } from "joi";
import Joi from "joi";
import type { EndowData } from "./types";

const endowDataShape: StrictSchemaMap<EndowData> = {
  name: Joi.string().min(3),
  ein: Joi.string()
    .required()
    .length(9)
    .pattern(/^[0-9]+$/),
  city: Joi.string().min(2),
  state: Joi.string().uppercase().min(2),
};

const schema = Joi.object(endowDataShape);

export const parseEndow = (input: unknown): ValidationResult<EndowData> =>
  schema.validate(input);
