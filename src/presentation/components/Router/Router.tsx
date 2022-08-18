import { SignUp } from "@/presentation/pages";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

type Props = {
  makeLogin: JSX.Element;
};

const Router: React.FC<Props> = ({ makeLogin }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={makeLogin} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
