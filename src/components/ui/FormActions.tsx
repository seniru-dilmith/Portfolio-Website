"use client";

import { motion } from "framer-motion";

interface FormActionsProps {
  /** Whether user is authenticated to show actions */
  isAuthenticated: boolean;
  /** Whether form is currently visible */
  viewForm: boolean;
  /** Function to toggle form visibility */
  onToggleForm: () => void;
  /** Whether currently editing (affects button text) */
  isEditing?: boolean;
  /** Custom button text when not editing */
  addText?: string;
  /** Custom button text when editing */
  editText?: string;
  /** Custom button text when hiding form */
  hideText?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the button */
  buttonClassName?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  isAuthenticated,
  viewForm,
  onToggleForm,
  isEditing = false,
  addText = "Add Item",
  editText = "Edit Item", 
  hideText = "Hide Form",
  className = "flex justify-between items-center mb-6",
  buttonClassName = "btn btn-primary shadow-lg",
}) => {
  if (!isAuthenticated) return null;

  const getButtonText = () => {
    if (viewForm) return hideText;
    if (isEditing) return editText;
    return addText;
  };

  return (
    <div className={className}>
      <motion.button
        className={buttonClassName}
        onClick={onToggleForm}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {getButtonText()}
      </motion.button>
    </div>
  );
};

export default FormActions;
