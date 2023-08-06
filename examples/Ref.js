

const Component = React.forwardRef((props, ref) => {

    const o = useMemo(() => new Observable(), []);
    ref.current = o.getPublicApi();
    const onClick = o.proxy("click");

    return (
        <button onClick={ onClick }/>
    )
});

function AnotherComponent() {
    const buttonRef = useRef(null);

    useOn(buttonRef.current, "click", () => console.log("clicked"));

    return (
        <Component ref={ buttonRef }/>
    )
}