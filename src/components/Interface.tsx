import * as React from 'react';

interface Props {
    onAdd: () => void;
    onClear: () => void;
}

export const Interface: React.SFC<Props> = (props: Props) => {
    return (
        <React.Fragment>
            <h1 className="title">The Social Network</h1>

            <a className="button add" onClick={props.onAdd}>
                <div>+</div>
            </a>
            <a className="button clear" onClick={props.onClear}>
                <div>-</div>
            </a>
        </React.Fragment>
    );
};
