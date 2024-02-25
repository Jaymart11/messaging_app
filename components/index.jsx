import { useEffect, useState } from "react";
import Chat from "./Chat";
import SBProvider from "@sendbird/uikit-react/SendbirdProvider";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";
import DeleteAccountButton from "./DeleteAccountButton";
import Modal from "./Modal";

const APP_ID = "5B166078-6117-4AAA-A106-A66CC578DA8D";

const index = () => {
  const user_id = localStorage.getItem("user_id");
  const [userId, setUserId] = useState(user_id);
  const [isModalShow, setIsModalShow] = useState(false);

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem("user_id")) {
        const generatedID = uuidv4();
        const generatedNickname = faker.person.fullName();

        const res = await fetch(`https://api-${APP_ID}.sendbird.com/v3/users`, {
          headers: {
            "Api-Token": "31f52659694d92b6bfd1787316d2a519f04040a4",
          },
          method: "POST",
          body: JSON.stringify({
            user_id: generatedID,
            nickname: generatedNickname,
            profile_url: "",
          }),
        });

        const data = await res.json();

        await localStorage.setItem("user_id", data.user_id);

        await fetch(`/api/user`, {
          headers: {
            "Api-Token": "31f52659694d92b6bfd1787316d2a519f04040a4",
          },
          method: "POST",
          body: JSON.stringify({
            user_id: data.user_id,
            nickname: generatedNickname,
            profile_url: data.profile_url,
          }),
        });

        setUserId(data.user_id);
      }
    })();
  }, []);

  return (
    <SBProvider appId={APP_ID} userId={userId}>
      {isModalShow && <Modal userId={userId} setIsModalShow={setIsModalShow} />}
      <Chat />
      {userId && <DeleteAccountButton setIsModalShow={setIsModalShow} />}
    </SBProvider>
  );
};

export default index;
