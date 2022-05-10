import {
  Footer,
  FormStatus,
  Input,
  LoginHeader
} from "@/presentation/components";
import { FormContext } from "@/presentation/contexts";
import React, { useState } from "react";
import styles from "./login-styles.scss";

type StateProps = {
  isLoading: boolean
  errorMessage: string
};

const Login: React.FC = () => {
  const [state] = useState<StateProps>({
    isLoading: false,
    errorMessage: ""
  });

  return (
    <div className={styles.login}>
      <LoginHeader />
      <FormContext.Provider value={state}>
        <form className={styles.form}>
          <h2>Login</h2>

          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />

          <button type="submit" className={styles.submit}>
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