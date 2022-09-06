import React from "react";
import { SignUp } from "@/presentation/pages";
import { makeSignUpValidation } from "./signup-validation-factory";
import { makeLocalSaveAccessToken } from "../../usecases/save-access-token/local-save-access-token-factory";

export const makeSignUp = (): JSX.Element => {
  return (
    <SignUp
      validation={makeSignUpValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  );
};
