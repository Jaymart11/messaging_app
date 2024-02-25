const APP_ID = "5B166078-6117-4AAA-A106-A66CC578DA8D";

function Modal({ userId, setIsModalShow }) {
  const handleDeleteAccount = async () => {
    try {
      await fetch(`https://api-${APP_ID}.sendbird.com/v3/users/${userId}`, {
        headers: {
          "Api-Token": "31f52659694d92b6bfd1787316d2a519f04040a4",
        },
        method: "DELETE",
      });

      await fetch(`/api/user`, {
        headers: {
          "Api-Token": "31f52659694d92b6bfd1787316d2a519f04040a4",
        },
        method: "PUT",
        body: JSON.stringify({
          user_id: userId,
          is_deleted: true,
        }),
      });

      localStorage.removeItem("user_id");
      alert("Account Deleted");
      window.location.reload();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="sendbird-modal" style={{ zIndex: 1000000 }}>
      <div className="sendbird-modal__content">
        <div className="sendbird-modal__header">
          <span className="sendbird-label sendbird-label--h-1 sendbird-label--color-onbackground-1">
            Do you want to delete this account?
          </span>
        </div>
        <div className="sendbird-modal__body">
          <span className="sendbird-label sendbird-label--subtitle-1 sendbird-label--color-onbackground-2"></span>
        </div>
        <div className="sendbird-modal__footer">
          <button
            className="sendbird-button sendbird-button--secondary sendbird-button--big"
            type="button"
            onClick={() => {
              setIsModalShow(false);
            }}
          >
            <span className="sendbird-button__text sendbird-label sendbird-label--button-1 sendbird-label--color-oncontent-1">
              <span className="sendbird-label sendbird-label--button-1 sendbird-label--color-onbackground-1">
                Cancel
              </span>
            </span>
          </button>
          <button
            className="sendbird-button sendbird-button--danger sendbird-button--big"
            type="button"
            onClick={() => {
              handleDeleteAccount();
              setIsModalShow(false);
            }}
          >
            <span className="sendbird-button__text sendbird-label sendbird-label--button-1 sendbird-label--color-oncontent-1">
              Delete
            </span>
          </button>
        </div>
        <div className="sendbird-modal__close">
          <button
            className="sendbird-iconbutton"
            type="button"
            style={{ height: "32px", width: "32px" }}
            onClick={() => {
              setIsModalShow(false);
            }}
          >
            <span className="sendbird-iconbutton__inner">
              <div
                className="sendbird-icon sendbird-icon-close"
                role="button"
                tabIndex="0"
                style={{
                  width: "24px",
                  minWidth: "24px",
                  height: "24px",
                  minHeight: "24px",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                  <path
                    fill="#000"
                    fillRule="evenodd"
                    d="M52.552 11.448a2.666 2.666 0 0 1 .222 3.52l-.222.251-16.781 16.78 16.781 16.782a2.665 2.665 0 0 1 0 3.771 2.666 2.666 0 0 1-3.52.222l-.251-.222L32 35.771 15.219 52.552a2.665 2.665 0 0 1-3.771 0 2.666 2.666 0 0 1-.222-3.52l.222-.251L28.228 32l-16.78-16.781a2.665 2.665 0 0 1 0-3.771 2.666 2.666 0 0 1 3.52-.222l.251.222 16.78 16.78 16.782-16.78a2.665 2.665 0 0 1 3.771 0"
                    className="icon-close_svg__fill"
                  ></path>
                </svg>
              </div>
            </span>
          </button>
        </div>
      </div>
      <div className="sendbird-modal__backdrop"></div>
    </div>
  );
}

export default Modal;
