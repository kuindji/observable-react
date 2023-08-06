/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import Observable from "@kuindji/observable"
import { useObservable, Provider } from "../dist/index"


test('should get observable from context', () => {
    const o = new Observable();
    let localValue;

    function Component() {
        const local = useObservable();
        localValue = local;
        return null;
    }

    function App() {
        return (
            <Provider observable={ o }>
                <Component/>
            </Provider>
        )
    }

    render(<App/>);

    expect(o === localValue).toBe(true);
});