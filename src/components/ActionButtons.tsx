
import {
  Trash2,
  Upload,
} from "lucide-react";
//action buttons
type ActionButtonsProps = {
  disabled: boolean;
  onUpload: () => void;
  onClear: () => void;
};

function ActionButtons({ onUpload, onClear, disabled }: ActionButtonsProps) {
  return (
    <>
      <button
        onClick={onUpload}
        disabled={disabled}
        className="flex items-center gap-2"
        data-testid="upload-button"
      >
        <Upload size={18} />
        Upload
      </button>
      <button
        className="flex items-center gap-2"
        onClick={onClear}
        disabled={disabled}
      >
        <Trash2 size={18} />
        Clear All
      </button>
    </>
  );
}

export default ActionButtons;