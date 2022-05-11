import { Authentication } from "@/domain/usecases";
import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
} from "@/presentation/components";
import { FormContext } from "@/presentation/contexts";
import { Validation } from "@/presentation/protocols/validation";
import React, { useEffect, useState } from "react";
import styles from "./login-styles.scss";

type Props = {
  validation?: Validation;
  authentication?: Authentication;
};

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    mainError: "",
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate("email", state.email),
      passwordError: validation.validate("password", state.password),
    });
  }, [state.email, state.password]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (state.isLoading) return;

    setState({
      ...state,
      isLoading: true,
    });

    await authentication.auth({
      email: state.email,
      password: state.password,
    });
  };

  return (
    <div className={styles.login}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />

          <button
            data-testid="submit"
            type="submit"
            className={styles.submit}
            disabled={!!state.emailError || !!state.passwordError}
          >
            Entrar
          </button>

          <span className={styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  );
};

export default Login;
