import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";

function DeleteItem({ pizzaId }) {
  const dispatch = useDispatch();

  return (
    <Button type="small" onClick={() => dispatch(deleteItem(pizzaId))}>
      {/* In the above deleteItem(pizzaId) dispatch action we should have the pizzaId to delete the item from the card but we don't
         have the access to the pizzaId in this component. So we are passing pizzaId as prop to this DeleteItem component from the 
          CartItem component which has access to the pizzaId */}
      Delete
    </Button>
  );
}

export default DeleteItem;
