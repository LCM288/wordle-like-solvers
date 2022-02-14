import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Wordle from "@/app/pages/wordle";
import { WithAppMenu } from "@/app/components/appMenu";

const App = (): React.ReactElement => {
  return (
    <>
      <MemoryRouter>
        <Routes>
          <Route index element={WithAppMenu(Wordle)} />
        </Routes>
      </MemoryRouter>
    </>
  );
};

export default App;
