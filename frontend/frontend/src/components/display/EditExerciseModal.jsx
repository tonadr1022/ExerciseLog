import { Modal, Box, Typography } from "@mui/material";
import React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
// const EditExerciseModal = ({ onClose, editExerciseData }) => {
//   console.log(editExerciseData.name);
//   return (
//     <Modal
//       open={true}
//       onClose={onClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description">
//       <Box sx={style}>
//         <Typography id="modal-modal-title" variant="h6" component="h2">
//           {editExerciseData.name}
//         </Typography>
//         <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//           Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
//         </Typography>
//       </Box>
//     </Modal>
//   );
// };
const EditExerciseModal = () => <div>editExerciseModal</div>;
export default EditExerciseModal;
