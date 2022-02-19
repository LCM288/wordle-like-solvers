import React from "react";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import Wordle from "@/app/pages/wordle/wordle";
import WordleHint from "@/app/pages/wordle/wordleHint";
import { WithAppMenu } from "@/app/components/appMenu";

const App = (): React.ReactElement => {
  return (
    <>
      <MemoryRouter>
        <Routes>
          <Route index element={WithAppMenu(<React.Fragment />)} />
          <Route path="wordle" element={WithAppMenu(<Outlet />)}>
            <Route index element={<Wordle />} />
            <Route path="hint" element={<WordleHint />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </>
  );
};

export default App;
