const APP_ID = "5B166078-6117-4AAA-A106-A66CC578DA8D";

const ChannelList = ({ channel, USER_ID }) => {
  const handleDeleteChannel = async (channel_url) => {
    const answer = prompt("Do you want to delete this channel? (Yes/No)");

    if (answer !== null) {
      const normalizedAnswer = answer.trim().toLowerCase();
      if (normalizedAnswer === "yes") {
        await fetch(
          `https://api-${APP_ID}.sendbird.com/v3/group_channels/${channel_url}`,
          {
            headers: {
              "Api-Token": "31f52659694d92b6bfd1787316d2a519f04040a4",
            },
            method: "DELETE",
          }
        );

        await fetch(`/api/channel`, {
          headers: {
            "Api-Token": "31f52659694d92b6bfd1787316d2a519f04040a4",
          },
          method: "PUT",
          body: JSON.stringify({
            channel_url: channel_url,
            deleted: true,
          }),
        });
      }
    }
  };

  const getInitials = (fullName) => {
    const parts = fullName.split(" ");
    const firstNameInitial = parts[0].charAt(0);
    const lastNameInitial = parts[parts.length - 1].charAt(0);
    const initials = firstNameInitial + lastNameInitial;
    return initials;
  };

  return (
    <div className="sendbird-channel-preview">
      <div className="delete-channel">
        <button
          onClick={() => {
            handleDeleteChannel(channel?._url);
          }}
        >
          Delete
        </button>
      </div>
      <div className="sendbird-channel-preview__avatar">
        <div
          className="sendbird-chat-header--avatar--group-channel sendbird-avatar"
          style={{ height: "56px", width: "56px", zIndex: 0 }}
        >
          <div
            className="sendbird-avatar-img sendbird-image-renderer"
            style={{
              width: "100%",
              minWidth: "calc(56px)",
              maxWidth: "400px",
              height: "calc(56px)",
            }}
          >
            <div
              className="sendbird-avatar-img--default"
              style={{ width: "56px", height: "56px" }}
            >
              <div
                className="sendbird-icon sendbird-icon-user sendbird-icon-color--content"
                style={{
                  width: "32.2px",
                  minWidth: "32.2px",
                  height: "32.2px",
                  minHeight: "32.2px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <b>
                  {getInitials(
                    channel.members.filter(
                      ({ userId }) => userId !== USER_ID
                    )[0].nickname
                  ) || "GC"}
                </b>
              </div>
            </div>
          </div>
          <img
            className="sendbird-image-renderer__hidden-image-loader"
            alt="Group Channel"
            src={channel?.coverUrl}
          />
        </div>
      </div>
      <div className="sendbird-channel-preview__content">
        <div className="sendbird-channel-preview__content__upper">
          <div className="sendbird-channel-preview__content__upper__header">
            <span className="sendbird-channel-preview__content__upper__header__channel-name sendbird-label sendbird-label--subtitle-2 sendbird-label--color-onbackground-1">
              {channel?.lastMessage?.sender?.userId === USER_ID ? (
                <b>You</b>
              ) : (
                ""
              )}
            </span>
          </div>
          <span className="sendbird-channel-preview__content__upper__last-message-at sendbird-label sendbird-label--caption-3 sendbird-label--color-onbackground-2">
            {channel?.lastMessage?.createdAt
              ? new Date(channel?.lastMessage?.createdAt).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )
              : ""}
          </span>
        </div>
        <div className="sendbird-channel-preview__content__lower">
          <span className="sendbird-channel-preview__content__lower__last-message sendbird-label sendbird-label--body-2 sendbird-label--color-onbackground-3">
            {channel?.lastMessage?.message}
          </span>
          <div className="sendbird-channel-preview__content__lower__unread-message-count"></div>
        </div>
      </div>
      <div className="sendbird-channel-preview__action">
        <div style={{ display: "inline-block" }}>
          <div className="sendbird-context-menu" style={{ display: "inline" }}>
            <button
              className="sendbird-iconbutton"
              style={{ height: "32px", width: "32px" }}
            >
              <span className="sendbird-iconbutton__inner">
                <div
                  className="sendbird-icon sendbird-icon-more sendbird-icon-color--primary"
                  style={{
                    width: "24px",
                    minWidth: "24px",
                    height: "24px",
                    minHeight: "24px",
                  }}
                ></div>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelList;
