import Alert from "./components/Alert";
import ListGroup from "./components/ListGroup";
function App() {
  let items=["New York","Spain","Italy","Russia"];
  const handleSelect=(item:string)=>
  {
    console.log(item);
  }
  return (
    <div>
      <Alert>
        hello <span>world</span>
      </Alert>
      ;
      <ListGroup items={items} heading="Cities" onSelectItem={handleSelect}/>
    </div>
  );
}
export default App;
