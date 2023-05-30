/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
const DeleteModal = ({ open, toggle, handleConfirm, itemType }) => {
  return (
    <Dialog open={open} onClose={toggle}>
      <DialogTitle>{`Are you sure you want to delete this ${itemType}?`}</DialogTitle>
      <DialogActions>
        <Button onClick={toggle}>Cancel</Button>
        <Button onClick={handleConfirm} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
