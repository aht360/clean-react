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
import { Link, useNavigate } from "react-router-dom";
import styles from "./login-styles.scss";

type Props = {
  validation?: Validation;
  authentication?: Authentication;
};

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const navigate = useNavigate();
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

    try {
      if (state.isLoading || !!state.emailError || !!state.passwordError) {
        return;
      }

      setState({
        ...state,
        isLoading: true,
      });

      const account = await authentication.auth({
        email: state.email,
        password: state.password,
      });

      localStorage.setItem("accessToken", account.accessToken);
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
    <div className={styles.login}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          data-testid="form"
        >
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

          <Link to="/signup" className={styles.link} data-testid="signup">
            Criar conta
          </Link>
          <FormStatus />
        </form>
      </FormContext.Provider>
      <Footer />
    </div>
  );
};

export default Login;
