import { body } from "express-validator";

export const productValidator = () => {
  return [
    body("image").isString(),
    body("rating").isFloat(),
    body("description").isString(),
    body("categoryId")
      .isString()
      .notEmpty()
      .withMessage("category should be a string"),
  ];
};
