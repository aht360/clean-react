import {
  Footer,
  FormStatus,
  Input,
  LoginHeader,
} from "@/presentation/components";
import { FormContext } from "@/presentation/contexts";
import React, { useState } from "react";
import styles from "./signup-styles.scss";

const SignUp: React.FC = () => {
  const [state, setState] = useState({
    isLoading: false,
    nameError: "Campo obrigatório",
    emailError: "Campo obrigatório",
    passwordError: "Campo obrigatório",
    passwordConfirmationError: "Campo obrigatório",
    mainError: "",
  });

  return (
    <div className={styles.signup}>
      <LoginHeader />
      <FormContext.Provider value={{ state }}>
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
