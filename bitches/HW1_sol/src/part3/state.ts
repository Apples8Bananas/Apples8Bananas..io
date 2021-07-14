export type State<S, A> = (initialState: S) => [S, A];

export const bind = <S, A, B>(m: State<S, A>, f: (x: A) => State<S, B>): State<S, B> =>
    (initialState: S) => {
        const [state, result] = m(initialState);
        return f(result)(state);
    };
