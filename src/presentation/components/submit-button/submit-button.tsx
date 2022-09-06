import { FormContext } from "@/presentation/contexts";
import React, { useContext } from "react";

type Props = {
  text: string;
};

const SubmitButton: React.FC<Props> = ({ text }: Props) => {
  const { state } = useContext(FormContext);

  return (
    <button type="submit" data-testid="submit" disabled={state.isFormInvalid}>
      {text}
    </button>
  );
};

export default SubmitButton;
