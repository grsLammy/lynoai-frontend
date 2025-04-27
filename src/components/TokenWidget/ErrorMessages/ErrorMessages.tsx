interface ErrorMessagesProps {
  isError: boolean;
  error: Error | null;
  purchase: {
    isError: boolean;
    isSuccess: boolean;
    error: Error | null;
  };
}

/**
 * Error messages component
 */
const ErrorMessages = ({ isError, error, purchase }: ErrorMessagesProps) => {
  return (
    <>
      {isError && (
        <div className="mt-4 p-2 text-red-500 bg-red-100 rounded">
          Error: {error?.message || "An error occurred"}
        </div>
      )}

      {purchase.isError && (
        <div className="mt-4 p-2 text-red-500 bg-red-100 rounded">
          Purchase Error: {purchase.error?.message || "An error occurred during purchase"}
        </div>
      )}

      {purchase.isSuccess && (
        <div className="mt-4 p-2 text-green-500 bg-green-100 rounded">
          Purchase successful! Your tokens will appear in your wallet shortly.
        </div>
      )}
    </>
  );
};

export default ErrorMessages; 