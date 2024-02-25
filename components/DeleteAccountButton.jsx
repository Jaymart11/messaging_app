function DeleteAccountButton({ setIsModalShow }) {
  return (
    <button
      className="delete-account"
      onClick={() => {
        setIsModalShow(true);
      }}
    >
      Delete Account
    </button>
  );
}

export default DeleteAccountButton;
