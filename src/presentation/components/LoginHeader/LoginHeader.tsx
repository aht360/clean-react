import React, { memo } from "react";
import { Logo } from "..";
import styles from "./login-header-styles.scss";

const LoginHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <h1>4Dev - Enquetes para Programadores</h1>
    </header>
  );
};

export default memo(LoginHeader);
