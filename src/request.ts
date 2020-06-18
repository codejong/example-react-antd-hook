import {useEffect, useReducer} from 'react';

export type Service<R, P extends any[]> = (...args: P) => Promise<R>;

export type RequestState = {
  data: any;
  error: any;
  pending: boolean;
  fulfilled: boolean;
  rejected: boolean;
};

export type RequestAction =
  | {type: 'request'}
  | {type: 'success'; payload: any}
  | {type: 'failure'; payload: string};

function reducer(state: RequestState, action: RequestAction): RequestState {
  switch (action.type) {
    case 'request':
      return {
        ...state,
        error: null,
        pending: true,
        fulfilled: false,
        rejected: false,
      };
    case 'success':
      return {
        data: action.payload,
        error: null,
        pending: false,
        fulfilled: true,
        rejected: false,
      };
    case 'failure':
      return {
        ...state,
        error: action.payload,
        pending: false,
        fulfilled: false,
        rejected: true,
      };
  }
}

export function useRequest<R, P extends any[]>(
  asyncTask: Service<R, P>,
  options?: {
    // autoFirstRun?: boolean;
    // passArgs?: P;
  },
) {
  // const {autoFirstRun = false, passArgs} = options || {};
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    error: null,
    pending: false,
    fulfilled: false,
    rejected: false,
  });

  const requestActions = {
    run: async (...args: P) => {
      dispatch({
        type: 'request',
      });
      try {
        // then 패턴 데신에 await을 쓴 이유는 일반 함수일 경우에도 동작하도록
        const data = await asyncTask(...args);
        dispatch({
          type: 'success',
          payload: data,
        });
      } catch (e) {
        dispatch({
          type: 'failure',
          payload: e,
        });
      }
    },
  };
  // useEffect(() => {
  //   if (autoFirstRun) {
  //     requestActions.run(...(passArgs as P));
  //   }
  //   return () => {};
  // }, []);
  return [state, requestActions] as const;
}
