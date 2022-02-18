import React, { useReducer } from "react";

const useForceUpdate = (): [number, React.DispatchWithoutAction] => {
  return useReducer<React.ReducerWithoutAction<number>>(
    (oldValue) => oldValue + 1,
    0
  );
};

export default useForceUpdate;
