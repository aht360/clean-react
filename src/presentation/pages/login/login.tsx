import { Authentication, SaveAccessToken } from "@/domain/usecases";
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
import styles from "./login-styles.scss";

type Props = {
  validation?: Validation;
  authentication?: Authentication;
  saveAccessToken: SaveAccessToken;
};

const Login: React.FC<Props> = ({
  validation,
  authentication,
  saveAccessToken,
}: Props) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    mainError: "",
  });

  useEffect(() => {
    const { email, password } = state;
    const formData = { email, password };

    const emailError = validation.validate("email", formData);
    const passwordError = validation.validate("password", formData);

    setState({
      ...state,
      emailError,
      passwordError,
      isFormInvalid: !!emailError || !!passwordError,
    });
  }, [state.email, state.password]);

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

      const account = await authentication.auth({
        email: state.email,
        password: state.password,
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

          <SubmitButton text="Entrar" />

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
