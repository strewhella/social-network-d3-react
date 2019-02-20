import * as React from 'react';

interface Props {
    onAdd: () => void;
    onClear: () => void;
}

export class Interface extends React.PureComponent<Props> {
    private adding: boolean;

    constructor(props: Props) {
        super(props);

        this.onAdd = this.onAdd.bind(this);
    }

    public render() {
        const { onAdd, onClear } = this.props;

        return (
            <React.Fragment>
                <h1 className="title">The Social Network</h1>

                <a className="button add" onClick={this.onAdd}>
                    <div>+</div>
                </a>
                <a className="button clear" onClick={onClear}>
                    <div>-</div>
                </a>
            </React.Fragment>
        );
    }

    private onAdd() {
        if (!this.adding) {
            this.adding = true;
            this.props.onAdd();
            setTimeout(() => {
                this.adding = false;
            }, 600);
        }
    }
}
