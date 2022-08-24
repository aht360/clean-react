import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
} from "@/presentation/components";
import { FormContext } from "@/presentation/contexts";
import { Validation } from "@/presentation/protocols/validation";
import React, { useEffect, useState } from "react";
import styles from "./signup-styles.scss";

type Props = {
  validation?: Validation;
};

const SignUp: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    name: "",
    email: "",
    nameError: "",
    emailError: "",
    passwordError: "Campo obrigatório",
    passwordConfirmationError: "Campo obrigatório",
    mainError: "",
  });

  useEffect(() => {
    setState({
      ...state,
      nameError: validation.validate("name", state.name),
      emailError: validation.validate("email", state.email),
    });
  }, [state.name, state.email]);

  return (
    <div className={styles.signup}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form className={styles.form}>
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

          <button
            type="submit"
            className={styles.submit}
            data-testid="submit"
            disabled
          >
            Criar
          </button>

          <span className={styles.link}>Voltar Para Login</span>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  );
};

export default SignUp;
