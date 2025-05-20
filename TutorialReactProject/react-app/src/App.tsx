import Alert from "./components/Alert";
import ListGroup from "./components/ListGroup";
import Button from "./components/Button";
import { useState } from "react";
function App() {
  let items = ["New York", "Spain", "Italy", "Russia", "India"];
  const handleSelect = (item: string) => {
    console.log(item);
  };
  const [AlertVisible, setAlertVisibility] = useState(false);
  return (
    <div>
      {AlertVisible && (
        <Alert onClose={()=>setAlertVisibility(false)}>
          hello <span>world</span>
        </Alert>
      )}
      <Button color="primary" onClick={() => setAlertVisibility(true)}>
        My Button
      </Button>
      <hr></hr>
      <ListGroup items={items} heading="Cities" onSelectItem={handleSelect} />
    </div>
  );
}
export default App;
