import { useState, useEffect } from "react";
import { GroupChannel } from "@sendbird/uikit-react/GroupChannel";
import { GroupChannelList } from "@sendbird/uikit-react/GroupChannelList";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import ChannelList from "./ChannelList";

const Chat = () => {
  const [updateMessage, setUpdateMessage] = useState(0);
  const globalStore = useSendbirdStateContext();
  const USER_ID = globalStore?.stores?.userStore?.user?.userId;
  const [currentChannelUrl, setCurrentChannelUrl] = useState("");

  const handleCreateChannel = async (channel) => {
    try {
      await fetch(`/api/channel`, {
        headers: {
          "Api-Token": "31f52659694d92b6bfd1787316d2a519f04040a4",
        },
        method: "POST",
        body: JSON.stringify({
          channel_url: channel._url,
          created_by: channel.creator.userId,
          chatmate: channel.members.filter((mem) => USER_ID !== mem.userId)[0]
            .userId,
        }),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateUser = async ({ nickname, plainProfileUrl, userId }) => {
    try {
      await fetch(`/api/user`, {
        headers: {
          "Api-Token": "31f52659694d92b6bfd1787316d2a519f04040a4",
        },
        method: "PUT",
        body: JSON.stringify({
          nickname: nickname,
          profile_url: plainProfileUrl,
          user_id: userId,
        }),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMessageChannel = async () => {
    try {
      await fetch(`/api/channel`, {
        headers: {
          "Api-Token": "31f52659694d92b6bfd1787316d2a519f04040a4",
        },
        method: "PUT",
        body: JSON.stringify({
          channel_url: currentChannelUrl,
          message_sent: true,
        }),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (updateMessage) handleMessageChannel();
  }, [updateMessage]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div style={{ display: "flex" }}>
        <div style={{ height: "100vh" }}>
          <GroupChannelList
            onChannelCreated={(channel) => {
              if (channel?.members?.length === 2) {
                setCurrentChannelUrl(channel?._url);
                handleCreateChannel(channel);
              } else {
                alert("Only 1-1 channels is allowed");
              }
            }}
            onChannelSelect={(channel) => {
              setCurrentChannelUrl(channel?._url);
            }}
            onUserProfileUpdated={(user) => {
              handleUpdateUser(user);
            }}
            renderChannelPreview={({ channel }) => {
              return <ChannelList channel={channel} USER_ID={USER_ID} />;
            }}
          />
        </div>
        <div style={{ width: "100%", height: "100vh" }}>
          <GroupChannel
            channelUrl={currentChannelUrl}
            onBeforeSendUserMessage={(e) => {
              setUpdateMessage((m) => m + 1);
              return e;
            }}
            onBeforeSendFileMessage={(e) => {
              setUpdateMessage((m) => m + 1);
              return e;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
