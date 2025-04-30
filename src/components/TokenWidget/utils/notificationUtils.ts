import toast from "react-hot-toast";

type NotificationType = "success" | "error" | "loading";

interface NotificationStyle {
  maxWidth: string;
  background: string;
  color: string;
  whiteSpace?: string;
}

/**
 * Shows a notification using react-hot-toast
 * @param type Type of notification (success, error, loading)
 * @param message The message to display
 * @param duration Duration in ms (default: 5000)
 * @param callback Optional callback function to execute after notification
 * @param customStyle Optional custom styles to apply
 */
export const showNotification = (
  type: NotificationType,
  message: string,
  duration = 5000,
  callback?: () => void,
  customStyle?: Partial<NotificationStyle>
) => {
  // Default style for all notifications
  const defaultStyle: NotificationStyle = {
    maxWidth: "400px",
    background: "#2a2a2a",
    color: "#fff",
  };

  // Add whiteSpace property for multiline messages if message contains newlines
  if (message.includes("\n")) {
    defaultStyle.whiteSpace = "pre-line";
  }

  // Merge default and custom styles
  const style = { ...defaultStyle, ...customStyle };

  // Set icon based on notification type
  const icon = type === "success" ? "🎉" : type === "error" ? "❌" : undefined;

  let toastId: string;

  // Show the appropriate toast based on type
  switch (type) {
    case "success":
      toastId = toast.success(message, {
        duration,
        style,
        icon,
      });
      break;
    case "error":
      toastId = toast.error(message, {
        duration,
        style,
        icon,
      });
      break;
    case "loading":
      toastId = toast.loading(message, {
        duration,
        style,
      });
      break;
    default:
      toastId = toast(message, {
        duration,
        style,
      });
  }

  // Execute callback if provided
  if (callback) {
    callback();
  }

  return toastId;
};

/**
 * Update an existing toast notification
 * @param id The ID of the toast to update
 * @param type The new type of the toast
 * @param message The new message for the toast
 */
export const updateNotification = (
  id: string,
  type: NotificationType,
  message: string
) => {
  if (type === "success") {
    toast.success(message, { id });
  } else if (type === "error") {
    toast.error(message, { id });
  } else {
    toast.loading(message, { id });
  }
};
