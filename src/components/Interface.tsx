import * as React from 'react';

interface Props {
    onAdd: () => void;
    onClear: () => void;
    onSearch: (search: string) => void;
    search: string;
}

export class Interface extends React.PureComponent<Props> {
    private adding: boolean;

    constructor(props: Props) {
        super(props);

        this.onAdd = this.onAdd.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    public render() {
        const { onClear, search } = this.props;

        return (
            <React.Fragment>
                <h1 className="title">The Social Network</h1>

                <a className="button add" onClick={this.onAdd}>
                    <div>+</div>
                </a>
                <a className="button clear" onClick={onClear}>
                    <div>-</div>
                </a>
                <input
                    className="search"
                    type="text"
                    placeholder="Search"
                    onChange={this.onSearch}
                    value={search}
                />
            </React.Fragment>
        );
    }

    private onAdd() {
        if (!this.adding) {
            this.adding = true;
            this.props.onAdd();
            setTimeout(() => {
                this.adding = false;
            }, 1000);
        }
    }

    private onSearch(event: any) {
        this.props.onSearch(event.target.value);
    }
}
