import * as React from 'react';

interface Props {
    onAdd: () => void;
    onClear: () => void;
}

export const Menu: React.SFC<Props> = (props: Props) => {
    return (
        <ul className="menu">
            <li>
                <button className="button" onClick={props.onAdd}>
                    Add
                </button>
            </li>
            <li>
                <button className="button" onClick={props.onClear}>
                    Clear
                </button>
            </li>
        </ul>
    );
};
