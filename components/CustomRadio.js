import { jsql } from "../functions/AllButThisJSON";

/**
 * this returns a custom style radio that accepts a title for the label,
 * and also accepts users changes to the style.
 *
 * it includes a state and setState feature that allwos the user to mutate the state of the invoking component
 *
 * additionally, this component depends on the jsql function from the `AllButThisJSON` package.
 *
 * @param { style, value, label, state, setState }
 * @returns
 */
export default function CustomRadio({ style, value, label, state, setState }) {
    return (
        <label style={style.label}>
            <input type="radio" name="bet-option" value={value} checked={value && state && jsql(state, value)} onChange={(e) => setState(e.target.value)} style={style} />
            {label}
        </label>
    );
}
