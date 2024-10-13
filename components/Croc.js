import { jsql } from "../functions/AllButThisJSON";

/**
 * This returns a custom style radio that accepts a title for the label,
 * and also accepts users changes to the style.
 *
 * It includes a state and setState feature that allows the user to mutate the state of the invoking component.
 *
 * Additionally, this component depends on the jsql function from the `AllButThisJSON` package.
 *
 * @param { style, value, label, state, setState }
 * @returns
 */
export default function Croc({ style, className, value, label, state, setState }) {
    const checked = value && state && jsql(state, value);

    return (
        <label className={"croc " + className} style={style?.label}>
            <input
                type="radio"
                className={className}
                name="bet-option"
                value={value}
                checked={checked}
                onChange={(e) => setState(e.target.value)}
                style={style?.input} // Inline styles for the radio button
            />
            <span className="checkmark" />
            <span className="label">{label}</span>
        </label>
    );
}
