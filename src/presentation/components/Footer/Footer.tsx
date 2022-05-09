import React, { memo } from "react";
import styles from "./footer-styles.scss";

const LoginHeader: React.FC = () => {
  return <footer className={styles.footer} />;
};

export default memo(LoginHeader);
