let root = ReactDOM.createRoot(document.getElementById("root"));

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gorevler: [],
    };
    this.clearItems = this.clearItems.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }
  deleteItem(item) {
    this.setState((prevState) => {
      const arr = prevState.gorevler.filter((i) => {
        return item != i;
      });
      return {
        gorevler: arr,
      };
    });
  }
  clearItems() {
    this.setState({
      gorevler: [],
    });
  }
  addItem(item) {
    if (this.state.gorevler.indexOf(item) > -1) {
      return "you can't add the same element";
    }

    this.setState((prevState) => {
      return {
        gorevler: prevState.gorevler.concat(item),
      };
    });
  }

  render() {
    const data = {
      baslik: "Todo Appliaction",
    };

    return (
      <div className="container my-5">
        <div className="card">
          <div className="card-header">
            <Header title={data.baslik} />
          </div>
          <div className="card-body">
            <TodoList
              deleteItem={this.deleteItem}
              clear={this.clearItems}
              items={this.state.gorevler}
            />
          </div>
          <div className="card-footer">
            <NewItem addItem={this.addItem} />
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    const json_obj = localStorage.getItem("items");
    const items = JSON.parse(json_obj);

    if (items) {
      this.setState({
        gorevler: items,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.gorevler.length !== this.state.gorevler.length) {
      const json_str = JSON.stringify(this.state.gorevler);
      localStorage.setItem("items", json_str);
    }
  }
}
const Header = (props) => {
  return (
    <div className="text-center">
      <h1 className="h3">{props.title}</h1>
    </div>
  );
};
class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      error: "",
    };
  }
  onFormSubmit(e) {
    e.preventDefault();

    const item = e.target.txtItem.value.trim();
    if (item) {
      e.target.txtItem.value = "";
      const error = this.props.addItem(item);
      this.setState({
        error: error,
      });
    }
  }
  render() {
    return (
      <div>
        {this.state.error && <p>{this.state.error}</p>}
        <form onSubmit={this.onFormSubmit}>
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              name="txtItem"
              placeholder="Add Todo"
            />
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    );
  }
}
const TodoList = (props) => {
  return (
    <div>
      <ul className="list-group">
        {props.items.map((item, i) => (
          <TodoItem deleteItem={props.deleteItem} key={i} item={item} />
        ))}
      </ul>
      {props.items.length > 0 ? (
        <button
          className="btn btn-outline-danger float-end mt-3"
          onClick={props.clear}
        >
          Clear
        </button>
      ) : (
        <div className="alert alert-warning">Add a Task</div>
      )}
    </div>
  );
};
const TodoItem = (props) => {
  return (
    <li className="list-group-item d-flex align-items-center justify-content-between">
      {props.item}
      <button
        className="btn btn-danger btn-sm"
        onClick={() => {
          props.deleteItem(props.item);
        }}
      >
        X
      </button>
    </li>
  );
};

root.render(<TodoApp />);
