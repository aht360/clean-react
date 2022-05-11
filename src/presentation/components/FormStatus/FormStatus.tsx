import { FormContext } from "@/presentation/contexts";
import React, { useContext } from "react";
import { Spinner } from "..";
import styles from "./form-status-styles.scss";

const FormStatus: React.FC = () => {
  const { state } = useContext(FormContext);
  const { isLoading, mainError } = state;

  return (
    <div data-testid="error-wrap" className={styles.errorWrap}>
      {isLoading && <Spinner className={styles.spinner} />}
      {!!mainError && <span className={styles.error}>{mainError}</span>}
    </div>
  );
};

export default FormStatus;
