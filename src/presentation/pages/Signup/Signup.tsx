import { AddAccount, SaveAccessToken } from "@/domain/usecases";
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
  SubmitButton,
} from "@/presentation/components";
import { FormContext } from "@/presentation/contexts";
import { Validation } from "@/presentation/protocols/validation";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./signup-styles.scss";

type Props = {
  validation?: Validation;
  addAccount?: AddAccount;
  saveAccessToken?: SaveAccessToken;
};

const SignUp: React.FC<Props> = ({
  validation,
  addAccount,
  saveAccessToken,
}: Props) => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    nameError: "",
    emailError: "",
    passwordError: "",
    passwordConfirmationError: "",
    mainError: "",
  });

  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state;
    const formData = { name, email, password, passwordConfirmation };

    const nameError = validation.validate("name", formData);
    const emailError = validation.validate("email", formData);
    const passwordError = validation.validate("password", formData);
    const passwordConfirmationError = validation.validate(
      "passwordConfirmation",
      formData
    );

    setState({
      ...state,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormInvalid:
        !!nameError ||
        !!emailError ||
        !!passwordError ||
        !!passwordConfirmationError,
    });
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      if (state.isLoading || state.isFormInvalid) {
        return;
      }

      setState({
        ...state,
        isLoading: true,
      });

      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      });

      await saveAccessToken.save(account.accessToken);

      navigate("/");
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message,
      });
    }
  };

  return (
    <div className={styles.signup}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form
          className={styles.form}
          data-testid="form"
          onSubmit={handleSubmit}
        >
          <h2>Criar Conta</h2>

          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder="Repita sua senha"
          />

          <SubmitButton text="Cadastrar" />

          <Link data-testid="login-link" className={styles.link} to="/login">
            Voltar Para Login
          </Link>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  );
};

export default SignUp;
