import { FormContext } from "@/presentation/contexts";
import React, { useContext } from "react";
import { Spinner } from "..";
import styles from "./form-status-styles.scss";

const FormStatus: React.FC = () => {
  const { isLoading, errorMessage } = useContext(FormContext);
  return (
    <div data-testid="error-wrap" className={styles.errorWrap}>
      {isLoading && <Spinner className={styles.spinner} />}
      {!!errorMessage && <span className={styles.error}>{errorMessage}</span>}
    </div>
  );
};

export default FormStatus;